# custom-styles-js-package

A simple library to replace inline styles inside html with css classes


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install custom-styles-js.

```
npm i custom-styles-js
```

## Usage

For quickstart:

```html
<!--Automatically creates new custom css style element and fills it with custom css classes for each custom-style-->

        <!--Pros
        1. Isn't using inline styles, everything about the styles is defined in CSS through javascript
        2. Allows reference creation to a specific style attribute for reuses and updates
        3. Allows time-controlled styling
        4. Manages your styles (and references) with JS, automatically injects and replaces in the DOM
        5. Replace 'style' with 'custom-style' and start styling your website the right way-->

        <!--simple usage of 'custom-style' attribute - creates a new css class in the custom-style with the value as properties and assings it to the element-->
        <div custom-style="
            background-color: yellow;
            color: grey;">
            asdasd
        </div>

        <!--'custom-style-ref' creates a reference for the custom css style class for future usage(another class reference or post-definition-update)-->
        <h1 custom-style-ref="1" 
        custom-style="
        color: red;
        font-size: 30px;">
            hello
        </h1>


        <!--if 'custom-style-ref' with the same value is already defined, adds the refered custom css style class to the element
        (if you use 'custom-style' here it'll override any styles defined in the refered element.)-->
        <h1 custom-style-ref="1">
            hello
        </h1>

        <!--overriden 'custom-style-ref'-->
        <h1 custom-style-ref="1" 
        custom-style="
            font-size: 10px;">
            hello
        </h1>

        <!--css class definition in 'custom-style' attribute-->
        <div custom-style="
            background-color: yellow;
            color: grey;
            .d{
                color: white;
            }">
            asdasd
            <div class="d">sdfsfd</div>
        </div>

        <!--overriden custom css style class definition in 'custom-style' attribute-->
        <h1 custom-style="
            color: blue;
            font-size: 20px;
            (1){
                color: white;
            }">
            hello
            <div custom-style-ref="1">
                hello
            </div>
        </h1>

        <!--inner element with 'custom-style' attribute-->
        <div custom-style="
            background-color: yellow;
            color: grey;">
            asdasd
            <div custom-style="
                color: blue;
                font-size: 50px;">
                sdfsfd
            </div>
        </div>

        <!--inline pseudo element (self)-->
        <h1 custom-style-ref="3" 
            custom-style="
            color: red;
            font-size: 30px;
            ():hover{
                color: pink;
            }">
            hello
        </h1>

        <!--pseudo elements overiding with already defined 'custom-style-ref' attribute-->
        <h1 custom-style-ref="3" 
            custom-style="
            ():hover{
                color: white;
            }">
            hello
        </h1>
    </main>
    <script>
        //Use this part to import all functionallity quickly
        const cs = new Promise(function (resolve, reject) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://raw.githubusercontent.com/DeanAseraf1/custom-styles-js/main/quick-start.js');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        let func = new Function(xhr.responseText);
                        let result = func();
                        resolve(result)
                    }
                };
                xhr.send(null);
            }
            catch (e) {
                reject(e);
            }
        });

        cs.then(customStyles => {
            //Your custom css style class updates
            //Examples below
            customStyles.addCustomRule(
            `@media screen and (min-width: 500px) {
                 (1) {
                     font-size: 50px;
                 }
             }`
        )
        customStyles.addCustomRules(
            `@keyframes example {
                from {background-color: red;}
                to {background-color: blue;}
            }`,
            `(1) {
                animation-name: example;
                animation-duration: 4s;
            }`
        )
        setTimeout(() => {
            customStyles.updateCustomStyle("1", "background-color", "green")
            customStyles.updateCustomStyles({
                "3": {
                  "box-shadow": "10px 5px 5px red"
                },

                "1": {
                    "margin-left": "10px"
                }
            })
        }, 2000)

    </script>
</body>

</html>
```
