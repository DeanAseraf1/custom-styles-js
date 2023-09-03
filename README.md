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
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <main>

        <!--Examples-->

        <!--Default behavior creates new css style element 'custom-style'-->
        <!--Simple usage of 'custom-style' attribute - creates new css class in the custom-style with the value as properties-->
        <div custom-style="
            background-color: yellow;
            color: grey;">
            asdasd
        </div>

        <!--'custom-style-ref' creates a reference for the custom css style class for future usage(another class reference or post-definition-update)-->
        <h1 custom-style-ref="1" custom-style="
            color: red;
            font-size: 30px;">
            hello
        </h1>
        <h1 custom-style-ref="2" custom-style="
            color: blue;
            font-size: 50px;">
            hello
        </h1>

        <!--if 'custom-style-ref' with the same value is already defined, uses the custom css style class instead(if overriden after definition then throws an error)-->
        <h1 custom-style-ref="1">
            hello
        </h1>

        <!--css class definition(for example, also ) in 'custom-style' attribute-->
        <div custom-style="
            background-color: yellow;
            color: grey;
            .d{
                color: white;
            }">
            asdasd
            <div class="d">sdfsfd</div>
        </div>

        <!--custom css style class definition in 'custom-style' attribute-->
        <h1 custom-style="
            color: blue;
            font-size: 20px;
            [1]{
                color: white;
            }">
            hello
            <div custom-style-ref="1">
                hello
            </div>
        </h1>

        <!--inner element 'custom-style' attribute-->
        <div custom-style="
            background-color: yellow;
            color: grey;">
            asdasd
            <div custom-style="
                color: blue;
                font-size: 50px;">
                sdfsfd
            </div>

            <!--pseudo elements in 'custom-style' attribute-->
            <h1 custom-style-ref="3" custom-style="
            color: red;
            font-size: 30px;
            []:hover{
                color: pink;
            }">
                hello
            </h1>

            <!--pseudo elements overiding with already defined 'custom-style-red' attribute-->
            <div custom-style="
        color: blue;
        font-size: 20px;
        [3]:hover{
            color: white;
        }">
                hello
                <h1 custom-style-ref="3">
                    hello
                </h1>
            </div>

        </div>
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
            setTimeout(() => {
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
            }, 2000)
        })

    </script>
</body>

</html>
```


## License

[ISC](https://www.isc.org/licenses/)
