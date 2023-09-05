const customStyles = (function () {

            //global variables
            const attributeName = "custom-style"
            const refAttributeName = "custom-style-ref"
            const stylesheetName = "custom-stylesheet"
            const customStylesReferences = []

            //in-function for getting a reference element from the array by key.
            const getCustomStyleRef = (key) => {
                const currentCustomStyleRef = customStylesReferences.find(item => item.key === key)
                if (!currentCustomStyleRef)
                    return null

                return currentCustomStyleRef;
            }

            //in-function for getting a specific rule from the CSS by reference-key.
            const getCustomStylesheetRule = (customStyleRef) => {
                const currentCustomStyleRef = getCustomStyleRef(customStyleRef)
                if (!currentCustomStyleRef) {
                    console.warn(`custom-style-ref="${customStyleRef}" is not defined.\nTry adding it to the refered element.`)
                    return null;
                }

                const customSheetRule = [...customStyleSheet.sheet.cssRules].find(item => item.selectorText === `.${currentCustomStyleRef.value}`)
                if (!customSheetRule) {
                    console.warn(`The css class ".${currentCustomStyleRef.value}" wasn't found.\nAre you sure you added a proper reference?`)
                    return null;
                }
                return customSheetRule;
            }

            //in-function for replace all the '(ref)' syntax with the correct class names in the cssText
            const updateRefrencesInCSS = (cssText) => {
                for (let i = 0; i < customStylesReferences.length; i++) {
                    const currentCustomStyleRef = getCustomStyleRef(customStylesReferences[i].key)
                    if (cssText.includes(`(${currentCustomStyleRef.key})`)) 
                        cssText = cssText.replaceAll(`(${currentCustomStyleRef.key})`, `.${currentCustomStyleRef.value}`)
                }
                return cssText;
            }

            //in-function for handaling pseudo syntax
            const updatePseudoRefencesInCSS = (cssText) => {
                const cleanText = cssText.replaceAll(/(\s|\t|\n|\r)*/gim, "");
                if (/\(\)(:|::)(\w|\s|\t|\n|\r)*{(.|\n)*}/gim.test(cleanText)) {
                    let arr = cleanText.split(/(\(\)|\{|\})/gim)
                    let pseudoProperties = [];
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] === "()") 
                            pseudoProperties.push({ pseudo: arr[i + 1], properties: arr[i + 3] });
                    }
                    return pseudoProperties;
                }
                return [];
            }

            //in-function(single-use) for creating the custom style sheet
            const customStyleSheet = (function () {
                //Creating the style element
                const customStyleSheet = document.createElement("style")
                customStyleSheet.setAttribute("id", stylesheetName)
                document.head.appendChild(customStyleSheet)

                //handaling main custom-styles
                const elements = document.querySelectorAll(`[${attributeName}]`)
                for (let i = 0; i < elements.length; i++) {
                    const attributeValue = elements[i].getAttribute(attributeName)
                    const newCssClassName = `${attributeName}-${i}`

                    //checking ref
                    let isRef = false;
                    if (elements[i].hasAttribute(refAttributeName)) {
                        const key = elements[i].getAttribute(refAttributeName)
                        const currentCustomStyleRef = getCustomStyleRef(key);
                        if (currentCustomStyleRef) 
                            elements[i].classList.add(currentCustomStyleRef.value);

                        isRef = true;
                        customStylesReferences.push({ key: key, value: newCssClassName })
                    }

                    //handaling pseudo elements
                    const pseudoObjects = updatePseudoRefencesInCSS(attributeValue);
                    for (let j = 0; j < pseudoObjects.length; j++) 
                        customStyleSheet.sheet.insertRule(
                            `.${newCssClassName}${pseudoObjects[j].pseudo} {\n\t${pseudoObjects[j].properties}\n}\n\n`,
                            customStyleSheet.sheet.cssRules.length)
                     
                    //inserting the main rule
                    customStyleSheet.sheet.insertRule(
                        `.${newCssClassName} {${updateRefrencesInCSS(attributeValue)}\n}\n\n`,
                        customStyleSheet.sheet.cssRules.length)

                    elements[i].removeAttribute(attributeName)
                    elements[i].classList.add(newCssClassName)

                    if (isRef)
                        elements[i].removeAttribute(refAttributeName)
                }

                //handaling custom-style-refs
                const referenceElements = document.querySelectorAll(`[${refAttributeName}]`)
                for (let i = 0; i < referenceElements.length; i++) {
                    customStyleRef = referenceElements[i].getAttribute(refAttributeName)
                    const customStyle = getCustomStyleRef(customStyleRef)
                    if (!customStyle) {
                        console.warn(`custom-style-ref="${customStyleRef}" is not defined.\nTry adding it to the refered element.\nAnd check that it uses a custom-style attribute.`)
                        return
                    }
                    referenceElements[i].classList.add(customStyle.value)
                    referenceElements[i].removeAttribute(refAttributeName)
                }

                return customStyleSheet
            })()

            //global functions
            //post-render custom-style update
            /**
             * This function updates a specific custom class thats refered with
             * the custom-style-ref attribure value.
             * @param customStyleRef Defined custom-style-sheet-ref attribute value(string).
             * @param propertyKey Property name to set on the custom-style(string).
             * @param propertyValue Property value to set on the custom-style(string).
             */
            const updateCustomStyle = (customStyleRef, propertyKey, propertyValue) => {
                const customRule = getCustomStylesheetRule(customStyleRef)
                if (!customRule)
                    return;

                customRule.style.setProperty(propertyKey, propertyValue)
            }

            //post-render custom-style update
            /**
             * This function updated multiple custom class thats refered with
             * the custom-style-ref attribute values.
             * @param customStylesObject Object with all updated custom properties(object).
             */
            const updateCustomStyles = (customStylesObject) => {
                const objectKeys = Object.keys(customStylesObject)
                for (let i = 0; i < objectKeys.length; i++) {
                    const currentDefinition = Object.values(customStylesObject)[i]
                    const currentKeys = Object.keys(currentDefinition)
                    for (let j = 0; j < currentKeys.length; j++) {
                        const key = currentKeys[j]
                        const value = Object.values(currentDefinition)[j]
                        updateCustomStyle(objectKeys[i], key, value)
                    }
                }
            }

            //post-render add custom rule
            /**
             * This function adds a rule to the custom stylesheet.
             * @param rule Rule to add to the custom stylesheet(string).
             * Use (ref) to specify a custom-style-ref.
             */
            const addCustomRule = (rule) => {
                customStyleSheet.sheet.insertRule(updateRefrencesInCSS(rule), customStyleSheet.sheet.cssRules.length)
            }

            //post-render add custom rules
            /**
             * This function adds multiple rules to the custom stylesheet.
             * @param rules Rules to add to the custom stylesheet(string[]).
             * Use (ref) to specify a custom-style-ref.
             */
            const addCustomRules = (...rules) => {
                for (let i = 0; i < rules.length; i++) {
                    addCustomRule(rules[i]);
                }
            }

            return { updateCustomStyle, updateCustomStyles, addCustomRule, addCustomRules }
        })()
