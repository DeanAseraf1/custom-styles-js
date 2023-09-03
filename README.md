# custom-styles-js-package

A simple library to replace inline styles inside html with css classes


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install custom-styles-js.

```
npm i custom-styles-js
```

## Usage
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <main>

        <!--Pros
        1. Isn't using inline styles, evreything about the styles is defined in CSS
        2. Allows reference creation to a specific style for reuse and update
        3. Allows controlled rendering
        4. Manages your styles (and references) with JS, automatic inject and replace in the DOM
        5. All needed is to replace 'style' with 'custom-style' for simplest usement-->


        <!--Default behavior creates new css style element-->
        <!--Simple usement 'custom-style' creates new css class in the custom-style with the value as properties-->
        <div
            custom-style="
            background-color: yellow;
            color: grey;">
            asdasd
        </div>

        <!--'custom-style-ref' creates a reference for the custom css style class for future usement(another class use or post-update)-->
        <h1 
            custom-style-ref="1"
            custom-style="
            color: red;
            font-size: 30px;">
            hello
        </h1>
        <h1 
            custom-style-ref="2"
            custom-style="
            color: blue;
            font-size: 50px;">
            hello
        </h1>
        
        <!--'custom-style-ref' with this value is already defined, uses the custom css style class instead-->
        <h1 
             custom-style-ref="1">
             hello
        </h1>

        <!--css class definition in 'custom-style' attribute-->
        <div
            custom-style="
            background-color: yellow;
            color: grey;
            .d{
                color: white;
            }">
            asdasd
            <div class="d">sdfsfd</div>
        </div>
        
        <!--custom css style class definition in 'custom-style' attribute-->
        <h1 
            custom-style="
            color: blue;
            font-size: 20px;
            [1]{
                color: white;
            }">
            hello
            <div 
                 custom-style-ref="1">
                 hello
            </div>
        </h1>

         <!--inner element 'custom-style' attribute-->
         <div
            custom-style="
            background-color: yellow;
            color: grey;">
            asdasd
            <div 
                custom-style="
                color: blue;
                font-size: 50px;">
            sdfsfd
         </div>

         <!--pseudo elements in 'custom-style' attribute-->
         <h1 
            custom-style-ref="3"
            custom-style="
            color: red;
            font-size: 30px;
            []:hover{
                color: pink;
            }">
         hello
        </h1>

        <!--pseudo elements overiding with already defined 'custom-style-red' attribute-->
        <div 
        custom-style="
        color: blue;
        font-size: 20px;
        [3]:hover{
            color: white;
        }">
            hello
            <h1 
            custom-style-ref="3">
                hello
            </h1>
        </div>

     </div>
    </main>
    <script>

        const customStyles = (function() {

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
                    if(cssText.includes(`[${currentCustomStyleRef.key}]`)){
                        cssText = cssText.replaceAll(`[${currentCustomStyleRef.key}]`, `.${currentCustomStyleRef.value}`)
                    }
                }
                return cssText;
            }
            const updatePseudoRefencesInCSS = (cssText) => {
                let cleanText = cssText.replaceAll(/(\s|\t|\n|\r)*/gim, "");
                if(/\[\](:|::)(\w|\s|\t|\n|\r)*{(.|\n)*}/gim.test(cleanText)){
                    let arr = cleanText.split(/(\[\]|\{|\})/gim)
                    console.log(arr);
                    let pseudoProperties = [];
                    for(let i = 0; i<arr.length; i++){
                        if(arr[i] === "[]"){
                            let isDoubleColon = [
                                "part", 
                                "after", 
                                "before", 
                                "marker", 
                                "slotted", 
                                "backdrop", 
                                "selection", 
                                "first-line", 
                                "placeholder", 
                                "target-text",
                                "first-letter", 
                                "grammar-error", 
                                "spelling-error", 
                                "file-selector-button"
                            ].includes(arr[i+1]);
                            pseudoProperties.push({pseudo: arr[i+1], properties: arr[i+3], isDoubleColon: isDoubleColon});
                            //pseudoProperties.push({pseudo: arr[i+1], properties: [...arr[i+3].split(";")]});
                        }
                    }
                    console.log(pseudoProperties);
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
                    clearWordRegex = /[\s]+/g
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
                            console.log(newRule);
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
        })()


        //Usement example
        customStyles.addCustomRule(
            `@media screen and (min-width: 500px) {
                [1] {
                    font-size: 20px;
                }
            }`
        )
        customStyles.addCustomRules(
            `@keyframes example {
                from {background-color: red;}
                to {background-color: blue;}
            }`, 
            `@keyframes example2 {
                from {background-color: blue;}
                to {background-color: yellow;}
            }`,
            `[1] {
                animation-name: example;
                animation-duration: 4s;
            }`,
            `[2] {
                animation-name: example2;
                animation-duration: 4s;

            }`
        )
        setTimeout(()=>{
            customStyles.updateCustomStyle("1", "background-color", "green")
            customStyles.updateCustomStyles({
                "2": {
                    "font-size": "100px",
                    "box-shadow": "10px 5px 5px red"
                }, 
                
                "1": { 
                    "margin-left":
                    "10px"
                }
            })
        },2000)
    </script>
</body>
</html>
```


## License

[ISC]([https://choosealicense.com/licenses/mit/](https://www.isc.org/licenses/)https://www.isc.org/licenses/)
