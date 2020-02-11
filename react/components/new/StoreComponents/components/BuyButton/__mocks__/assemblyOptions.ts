import { AssemblyOptions } from "../assemblyUtils";

export const customBell: AssemblyOptions = {
  "items": {
    "add-on_Add-on": [
      {
        "name": "Bells add-ons Logo small",
        "id": "2000588",
        "initialQuantity": 0,
        "quantity": 1,
        "seller": "1",
        "price": 75,
        "choiceType": "TOGGLE",
        "children": null
      },
      {
        "name": "Bells add-ons Logo big",
        "id": "2000589",
        "initialQuantity": 0,
        "quantity": 1,
        "seller": "1",
        "price": 90,
        "choiceType": "TOGGLE",
        "children": null
      },
      {
        "name": "Bells add-ons Plaque",
        "id": "2000590",
        "initialQuantity": 0,
        "quantity": 0,
        "seller": "1",
        "price": 60,
        "choiceType": "TOGGLE",
        "children": null
      }
    ],
    "text_style_Text Style": [
      {
        "name": "Bells add-ons Roman",
        "id": "2000591",
        "initialQuantity": 1,
        "quantity": 0,
        "seller": "1",
        "price": 0,
        "choiceType": "SINGLE",
        "children": null
      },
      {
        "name": "Bells add-ons Script",
        "id": "2000592",
        "initialQuantity": 0,
        "quantity": 1,
        "seller": "1",
        "price": 15,
        "choiceType": "SINGLE",
        "children": null
      }
    ],
    "engraving_Engraving": [
      {
        "name": "Bells add-ons 1-3 lines",
        "id": "2000586",
        "initialQuantity": 0,
        "quantity": 1,
        "seller": "1",
        "price": 26,
        "choiceType": "SINGLE",
        "children": {
          "1-3-lines": []
        }
      },
      {
        "name": "Bells add-ons 4 lines",
        "id": "2000587",
        "initialQuantity": 0,
        "quantity": 0,
        "seller": "1",
        "price": 30,
        "choiceType": "SINGLE",
        "children": {
          "4-lines": []
        }
      }
    ]
  },
  "inputValues": {},
  "areGroupsValid": {
    "add-on_Add-on": true,
    "text_style_Text Style": true,
    "engraving_Engraving": true
  }
}

export const starColor = {
  "items": {
    "Customization": []
  },
  "inputValues": {
    "Customization": {
      "Font": "Sans serif",
      "Front text": "Frente",
      "Back text": "Verso",
      "Glossy print": true
    }
  },
  "areGroupsValid": {
    "Customization": true
  }
}

export const comboPizza: AssemblyOptions = {
  "items": {
    "pizza_composition_Pizza flavor": [
      {
        "name": "Pizza Monster promo",
        "id": "5101",
        "initialQuantity": 1,
        "quantity": 1,
        "seller": "1",
        "price": 0,
        "choiceType": "SINGLE",
        "children": {
          "pizza_extra_ingredients_Extra": [
            {
              "name": "Ingredients bacon",
              "id": "602",
              "initialQuantity": 0,
              "quantity": 0,
              "seller": "1",
              "price": 1,
              "choiceType": "MULTIPLE",
              "children": null
            },
            {
              "name": "Ingredients herb",
              "id": "603",
              "initialQuantity": 0,
              "quantity": 1,
              "seller": "1",
              "price": 1,
              "choiceType": "MULTIPLE",
              "children": null
            },
            {
              "name": "Ingredients mushroom",
              "id": "605",
              "initialQuantity": 0,
              "quantity": 0,
              "seller": "1",
              "price": 1,
              "choiceType": "MULTIPLE",
              "children": null
            },
            {
              "name": "Ingredients onion",
              "id": "606",
              "initialQuantity": 0,
              "quantity": 0,
              "seller": "1",
              "price": 1,
              "choiceType": "MULTIPLE",
              "children": null
            },
            {
              "name": "Ingredients pepper",
              "id": "607",
              "initialQuantity": 0,
              "quantity": 0,
              "seller": "1",
              "price": 1,
              "choiceType": "MULTIPLE",
              "children": null
            },
            {
              "name": "Ingredients tomato",
              "id": "609",
              "initialQuantity": 0,
              "quantity": 1,
              "seller": "1",
              "price": 1,
              "choiceType": "MULTIPLE",
              "children": null
            }
          ],
          "pizza_basic_ingredients_pizza_basic_ingredients": [
            {
              "name": "Ingredients bacon",
              "id": "602",
              "initialQuantity": 1,
              "quantity": 0,
              "seller": "1",
              "price": 0,
              "choiceType": "TOGGLE",
              "children": null
            },
            {
              "name": "Ingredients onion",
              "id": "606",
              "initialQuantity": 1,
              "quantity": 1,
              "seller": "1",
              "price": 0,
              "choiceType": "TOGGLE",
              "children": null
            },
            {
              "name": "Ingredients tomato",
              "id": "609",
              "initialQuantity": 1,
              "quantity": 1,
              "seller": "1",
              "price": 0,
              "choiceType": "TOGGLE",
              "children": null
            }
          ]
        }
      }
    ],
    "drinks_size_double_Choose 2 drinks": [
      {
        "name": "Cola 600ml",
        "id": "110",
        "initialQuantity": 2,
        "quantity": 1,
        "seller": "1",
        "price": 0,
        "choiceType": "MULTIPLE",
        "children": null
      },
      {
        "name": "Cola diet 600ml",
        "id": "120",
        "initialQuantity": 0,
        "quantity": 0,
        "seller": "1",
        "price": 0,
        "choiceType": "MULTIPLE",
        "children": null
      },
      {
        "name": "Orange Juice 600ml",
        "id": "180",
        "initialQuantity": 0,
        "quantity": 0,
        "seller": "1",
        "price": 3,
        "choiceType": "MULTIPLE",
        "children": null
      }
    ]
  },
  "inputValues": {},
  "areGroupsValid": {
    "pizza_composition_Pizza flavor": true,
    "drinks_size_double_Choose 2 drinks": false
  }
}