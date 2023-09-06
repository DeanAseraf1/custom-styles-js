# custom-styles-js-package

A simple library to replace inline styles inside html with css classes


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install custom-styles-js.

```
npm i custom-styles-js
```

## Usage

Quickstart example:

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
