//global-properties
            const attributeName = "custom-style"
            const refAttributeName = "custom-style-ref"
            const stylesheetName = "custom-stylesheet"
            const customStylesReferences= []

            const getCustomStyleRef = (key) =>{
                const currentCustomStyleRef = customStylesReferences.find(item=>item.key === key)
                if(!currentCustomStyleRef) 
                    return null

                return currentCustomStyleRef;
            }
            
            const getCustomStylesheetRule = (customStyleRef) => {
                const currentCustomStyleRef = getCustomStyleRef(customStyleRef)
                if(!currentCustomStyleRef) {
                    console.warn(`custom-style-ref="${customStyleRef}" is not defined.\nTry adding it to the refered element.`)
                    return null;
                }
                
                const customSheetRule = [...customStyleSheet.sheet.cssRules].find(item=>item.selectorText === `.${currentCustomStyleRef.value}`)
                if(!customSheetRule) {
                    console.warn(`The css class ".${currentCustomStyleRef.value}" wasn't found.\nAre you sure you added a proper reference?`)
                    return null;
                }
                
                return customSheetRule;
            }

            const updateRefrencesInCSS = (cssText) =>{
                for(let i = 0; i< customStylesReferences.length; i++){
                    const currentCustomStyleRef = getCustomStyleRef(customStylesReferences[i].key)
                    if(cssText.includes(`(${currentCustomStyleRef.key})`)){
                        cssText = cssText.replaceAll(`(${currentCustomStyleRef.key})`, `.${currentCustomStyleRef.value}`)
                    }
                }
                return cssText;
            }
            const updatePseudoRefencesInCSS = (cssText) => {
                let cleanText = cssText.replaceAll(/(\s|\t|\n|\r)*/gim, "");
                if(/\(\)(:|::)(\w|\s|\t|\n|\r)*{(.|\n)*}/gim.test(cleanText)){
                    let arr = cleanText.split(/(\(\)|\{|\})/gim)
                    let pseudoProperties = [];
                    for(let i = 0; i<arr.length; i++){
                        if(arr[i] === "()"){
                            pseudoProperties.push({pseudo: arr[i+1], properties: arr[i+3]});
                            //pseudoProperties.push({pseudo: arr[i+1], properties: [...arr[i+3].split(";")]});
                        }
                    }
                    return pseudoProperties;
                }
                return [];
            }

            const customStyleSheet = (function(){
                const customStyleSheet = document.createElement("style")
                customStyleSheet.setAttribute("id", stylesheetName)
                document.head.appendChild(customStyleSheet)

                //handaling main custom-styles
                const elements = document.querySelectorAll(`[${attributeName}]`)
                    //clearWordRegex = /[\s]+/g
                    for(let i = 0; i < elements.length; i++){
                        const attributeValue = elements[i].getAttribute(attributeName)
                        const newCssClassName = `${attributeName}-${i}`
                        let isRef = false;
                        if(elements[i].hasAttribute(refAttributeName)){
                            const key = elements[i].getAttribute(refAttributeName)
                            const currentCustomStyleRef = getCustomStyleRef(key);
                            if(currentCustomStyleRef){
                                console.warn(`custom-style-ref="${key} is already declared."\nPlease use different value.`)
                                return
                            }
                            isRef = true;
                            customStylesReferences.push({key: key, value: newCssClassName})
                        }
                        const newCssRule = `.${newCssClassName} {${updateRefrencesInCSS(attributeValue)}\n}\n\n`
                        const pseudoObjects = updatePseudoRefencesInCSS(attributeValue);
                        for(let j = 0 ; j< pseudoObjects.length; j++){
                            const newRule = `.${newCssClassName}${pseudoObjects[j].pseudo} {\n\t${pseudoObjects[j].properties}\n}\n\n`
                            customStyleSheet.sheet.insertRule(newRule, customStyleSheet.sheet.cssRules.length)
                        }
                        //const newCssRule = `.${newCssClassName} {${attributeValue}\n}\n\n`
                        //customStyleSheet.innerHTML += newCssRule
                        customStyleSheet.sheet.insertRule(newCssRule, customStyleSheet.sheet.cssRules.length)
                        elements[i].removeAttribute(attributeName)
                        elements[i].classList.add(newCssClassName)
                        
                        if(isRef)
                            elements[i].removeAttribute(refAttributeName)
                        
                    }
                
                //handaling custom-style-refs
                const referenceElements = document.querySelectorAll(`[${refAttributeName}]`)
                    for(let i = 0; i < referenceElements.length; i++){
                        customStyleRef = referenceElements[i].getAttribute(refAttributeName)
                        const customStyle = getCustomStyleRef(customStyleRef)
                        if(!customStyle){
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
             * @param customStyleRef Defined custom-style-sheet-ref attribute value.
             * @param propertyKey Property name to set on the custom-style.
             * @param propertyValue Property value to set on the custom-style.
             */
            const updateCustomStyle = (customStyleRef, propertyKey, propertyValue) => {
                const customRule = getCustomStylesheetRule(customStyleRef)
                if(!customRule)
                    return;
                
                customRule.style.setProperty(propertyKey, propertyValue)
            }

            //post-render custom-style update
            /**
             * @param customStylesObject an object with all updated custom properties.
             */
            const updateCustomStyles = (customStylesObject) => {
                const objectKeys = Object.keys(customStylesObject)
                for(let i = 0; i < objectKeys.length; i++){
                    const currentDefinition = Object.values(customStylesObject)[i]
                    const currentKeys = Object.keys(currentDefinition)
                    for(let j = 0; j < currentKeys.length; j++){
                        const key = currentKeys[j]
                        const value = Object.values(currentDefinition)[j]
                        updateCustomStyle(objectKeys[i], key, value)
                    }
                }
                
            }

            //post-render add custom rule
            /**
             * @param rule Rule to add to the custom stylesheet as a string.
             * Use [] to specify a custom-style-ref.
             */
            const addCustomRule = (rule) => {
                
                customStyleSheet.sheet.insertRule(updateRefrencesInCSS(rule), customStyleSheet.sheet.cssRules.length)
            }
            
            //post-render add custom rules
            /**
             * @param rules Rules to add to the custom stylesheet as a string.
             * Use [] to specify a custom-style-ref.
             */
            const addCustomRules = (...rules) => {
                for(let i = 0; i < rules.length; i++){
                    addCustomRule(rules[i]);
                }
            }

            return { updateCustomStyle, updateCustomStyles, addCustomRule, addCustomRules }
