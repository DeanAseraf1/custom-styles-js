# custom-styles-js-package

A simple library to replace inline styles inside html with css classes


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install custom-styles-js.

```
npm i custom-styles-js
```

## Usage

Quickstart example(html):

```html
<!--Automatically creates new custom css style element and fills it with custom css classes for each custom-style-->
 <!--simple usage of 'custom-style' attribute - creates a new css class in the custom-style with the value as properties and assings it to the element-->
        <div data-style="
            background-color: yellow;
            color: grey;">
            asdasd
        </div>

        <!--the 'custom-style' attribute will override every priorty level lower then css classes (included)-->
        <div data="dv" 
        data-style="
            background-color: yellow;
            color: grey;">
            asdasd
        </div>

        <!--'custom-style-ref' creates a reference for the custom css style class for future usage(another class reference or post-definition-update)
        specifically used independently from other files to avoid files loading time differences-->
        <h1 data-style-src="1" 
        data-style="
            color: red;
            font-size: 30px;">
            hello
        </h1>

        <!--if 'custom-style-ref' with the same value is already defined, adds the refered custom css style class to the element
        (if you use 'custom-style' here it'll override any styles defined in the refered element for this one only, you can't create reference to a refered style.)-->
        <h1 data-style-ref="1">
            hello
        </h1>

        <!--overriden 'custom-style-ref'-->
        <h1 data-style-ref="1" 
        data-style="
            font-size: 10px;">
            hello
        </h1>

        <!--css class definition in 'custom-style' attribute-->
        <div data-style="
            background-color: yellow;
            color: grey;
            .d{
                color: white;
            }">
            asdasd
            <div class="d">sdfsfd</div>
        </div>

        <!--overriden custom css style class definition in 'custom-style' attribute-->
        <h1 data-style="
            color: blue;
            font-size: 20px;
            (1){
                color: white;
            }">
            hello
            <div data-style-ref="1">
                hello
            </div>
        </h1>

        <!--inner element with 'custom-style' attribute-->
        <div data-style="
            background-color: yellow;
            color: grey;">
            asdasd
            <div data-style="
                color: blue;
                font-size: 50px;">
                sdfsfd
            </div>
        </div>

        <!--inline pseudo element (self)-->
        <h1 data-style-src="3" 
        data-style="
            color: red;
            font-size: 30px;
            ~:hover{
                color: pink;
            }">
            hello
        </h1>

        <!--pseudo elements overiding with already defined 'custom-style-ref' attribute-->
        <h1 data-style-ref="3" 
        data-style="
            ~:hover{
                color: white;
            }">
            hello
        </h1>
    </script>
</body>
</html>
```

Usage in React

1. Create new file 'useCustomStyles.jsx'(copy & paste):

```jsx

import { useRef } from "react"

let customStyleSheet;

export const useCustomStylesheet = () => {
    if (!document.querySelector("#custom-stylesheet")) {
        customStyleSheet = document.createElement("style")
        customStyleSheet.setAttribute("id", "custom-stylesheet")
        document.head.appendChild(customStyleSheet)
    }
}

export const useCustomStylesRef = () => {
    const refs = useRef([]);
    const attributeName = "data-style"
    const srcAttributeName = "data-style-src"
    const refAttributeName = "data-style-ref"
    const customStylesReferences = []

    const styleName = "style"
    const srcName = "styleSrc"
    const refName = "styleRef"

    const pseudoSyntax = "~"
    const pseudoRegex = () => new RegExp(`${pseudoSyntax}(:|::)(\\w|\\s|\\t|\\n|\\r)*{(.|\\s|\\t|\\n|\\r)*}`, "gim")
    const pseudoBracketsRegex = () => new RegExp(`(\\${pseudoSyntax}|\\{|\\})`, "gim")

    const getNewCssClass = (className, classContent) => `.${className} {\n\t${classContent}\n}\n\n`
    const getNewCssClassName = (...names) => names.join("-");
    const getRefSyntax = (ref) => `(${ref})`
    const getRefCssClass = (ref) => `.${ref}`


    //in-function for getting a reference element from the array by key.
    const getCustomStyleRef = (key) => {
        const currentCustomStyleRef = customStylesReferences.find(item => item.key === key)
        if (!currentCustomStyleRef)
            return null

        return currentCustomStyleRef;
    }

    //in-function for replace all the '(ref)' syntax with the correct class names in the cssText
    const updateRefrencesInCSS = (cssText) => {
        for (let i = 0; i < customStylesReferences.length; i++) {
            const currentCustomStyleRef = getCustomStyleRef(customStylesReferences[i].key)
            const refName = getRefSyntax(currentCustomStyleRef.key)
            if (cssText.includes(refName))
                cssText = cssText.replaceAll(refName, getRefCssClass(currentCustomStyleRef.value))
        }
        return cssText;
    }

    //in-function for handaling pseudo syntax
    const updatePseudoRefencesInCSS = (cssText) => {
        if (pseudoRegex().test(cssText)) {
            let arr = cssText.split(pseudoBracketsRegex())
            let pseudoProperties = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === pseudoSyntax)
                    pseudoProperties.push({ pseudo: arr[i + 1], properties: arr[i + 3] });
            }
            return { pseudoProperties: pseudoProperties, newCss: cssText.replaceAll(pseudoBracketsRegex(), "") };
        }
        return { pseudoProperties: [], newCss: cssText };
    }

    const refHandler = (ref) => {
        if (ref && !refs.current.includes(ref)) {
            refs.current.push(ref)

            if (ref.hasAttribute(attributeName)) {
                const attributeValue = ref.dataset[styleName]
                const newCssClassName = getNewCssClassName(attributeName, refs.current.length - 1);

                //checking ref
                let isRef = false;
                if (srcName in ref.dataset) {
                    const key = ref.dataset[srcName]
                    const currentCustomStyleRef = getCustomStyleRef(key);
                    if (currentCustomStyleRef)
                        console.warn(`custom-style-src="${key} is already declared."\nPlease use different value.`)

                    isRef = true;
                    customStylesReferences.push({ key: key, value: newCssClassName })
                }

                let isCopy = false;
                if (refName in ref.dataset) {
                    const key = ref.dataset[refName]
                    const currentCustomStyleRef = getCustomStyleRef(key);
                    console.log(currentCustomStyleRef);
                    if (currentCustomStyleRef)
                        ref.classList.add(currentCustomStyleRef.value);

                    isCopy = true;
                }

                //handaling pseudo elements
                const pseudoUpdates = updatePseudoRefencesInCSS(attributeValue)
                const pseudoObjects = pseudoUpdates.pseudoProperties;
                for (let j = 0; j < pseudoObjects.length; j++) {
                    customStyleSheet.sheet.insertRule(
                        getNewCssClass(`${newCssClassName}${pseudoObjects[j].pseudo}`, updateRefrencesInCSS(pseudoObjects[j].properties)),
                        customStyleSheet.sheet.cssRules.length)
                }

                //inserting the main rule
                customStyleSheet.sheet.insertRule(
                    getNewCssClass(newCssClassName, updateRefrencesInCSS(pseudoUpdates.newCss)),
                    customStyleSheet.sheet.cssRules.length)

                ref.removeAttribute(attributeName)
                ref.classList.add(newCssClassName)


                if (isRef)
                    ref.removeAttribute(srcAttributeName)
                if (isCopy)
                    ref.removeAttribute(refAttributeName);
            }

            const referenceElements = document.querySelectorAll(`[${refAttributeName}]`)
            for (let i = 0; i < referenceElements.length; i++) {
                const customStyleRef = referenceElements[i].dataset[refName]
                const customStyle = getCustomStyleRef(customStyleRef)
                if (!customStyle) {
                    //    console.warn(`custom-style-ref="${customStyleRef}" is not defined.\nTry adding it to the refered element.\nAnd check that it uses a custom-style attribute.`)
                    return
                }
                referenceElements[i].classList.add(customStyle.value)
                referenceElements[i].removeAttribute(refAttributeName)
            }
        }

        return refs;
    }

    return [refHandler]

}
```

2. Insert into 'App.jsx' (copy & paste):

```jsx
//...
import { useCustomStylesheet } from 'your/path/to/useCustomStyles.jsx';//importing the hook
//...
useCustomStylesheet();//using the hook (at the top of App functions body)
//...
```

3. Apply in your components (component example):

```jsx

  // 'data-style' attribute => creates a new css class and assigns it to the element(same syntax as style).
  // use the `~` synatx to style pseudo elements with pseudo element selectors.
  // use the "@" synatx to create media queries on the element.
  // 'data-style-src' attribute => creates a new source to the css class named as the value of the attribute(used with ref in a single file).
  // 'data-style-ref' attribute => reference a source and adds the css class to the element (used with src in a single file).
  // its possible to use 'data-style-ref' and override some of the styles with 'data-style'


import React from "react";
import { useCustomStylesRef } from "your/path/to/useCustomStyles.jsx";

export const Home = () => {
    const colors = ["green", "yellow", "red", "blue", "orange"];
    const lines = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const [customStyleHandler] = useCustomStylesRef();


    return (
        <>
            <div ref={customStyleHandler}
            data-style-src="test1"
            data-style="
                color:blue;
                ~:hover{
                    color:white
                }
                ">Laaaaaaaaa</div>

            Inline styles
            {lines.map((line, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            backgroundColor: colors[index % colors.length],
                            color: colors[(index + 1) % colors.length]
                        }}>
                        {line}
                    </div>
                )
            })}

            Custom styles
            {lines.map((line, index) => {
                return (
                    <div
                        ref={customStyleHandler}
                        key={index + lines.length}
                        data-style={`
                    background-color: ${colors[index % colors.length]};
                    color:${colors[(index + 1) % colors.length]};`}>
                        {line}
                    </div>)
            })}

            Custom style ref & src
            <div
                ref={customStyleHandler}
                data-style-src="test4"
                data-style="
                color:blue;
                ~:hover{
                    color:white
                }
                ">
                hello1
            </div>

            <div
                ref={customStyleHandler}
                data-style-ref="test4">
                hello2
            </div>

            <div
                ref={customStyleHandler}
                data-style-ref="test4"
                data-style="color:green;">
                hello3
            </div>

            <div
                ref={customStyleHandler}
                data-style-ref="test4"
                data-style="~:hover{
                    color:pink;
                    }">
                hello4
            </div>

            <div
                ref={customStyleHandler}
                data-style-ref="test4"
                data-style="
                @media screen and (max-width: 600px){
                    font-size: 30px;
                }">
                hello5
            </div>

        </>
    );
}
```
