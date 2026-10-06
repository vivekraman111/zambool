# Zambool

A data-coded component framework for AI.

Describe your React app structure using JSON. Iterate fast using AI prompts.

## What is Zambool?

A conventional React application describes its UI structure using JSX. Changes to the UI structure require the application to be rebuilt. With Zambool, the UI structure is described using JSON and can be modified without rebuilding the application.

The developer defines the data source and transformations, and creates the leaf components. Zambool provides the framework to wire data from the source to the leaf components.

## Example

This simple image gallery illustrates the basic principles of Zambool.

![Zambool image gallery](docs/image-gallery.jpg)

### JSON
The UI structure is described using JSON. The JSON defines the data provider, iteration, and the leaf components used to render each gallery item. The JSON can be stored externally and loaded at runtime, allowing the UI structure to be modified without rebuilding the application.

```json
{
  "type": "DataProviderGeneric",
  "props": {
    "schema": {
      "gallery": [
        {
          "id": 1,
          "image": "/image_gallery/fox-forest-snow.jpg",
          "title": "Winter Forest"
        },
        {
          "id": 2,
          "image": "/image_gallery/fox-autumn.jpg",
          "title": "Autumn Wind"
        },
        {
          "id": 3,
          "image": "/image_gallery/fox-dry-grass.jpg",
          "title": "Dawn Meadow"
        },
        {
          "id": 4,
          "image": "/image_gallery/fox-desert.jpg",
          "title": "Fennec Fox"
        },
        {
          "id": 5,
          "image": "/image_gallery/fox-resting.jpg",
          "title": "Forest Rest"
        },
        {
          "id": 6,
          "image": "/image_gallery/fox-coast.jpg",
          "title": "Coastal Explorer"
        },
        {
          "id": 7,
          "image": "/image_gallery/fox-arctic.jpg",
          "title": "Arctic Fox"
        },
        {
          "id": 8,
          "image": "/image_gallery/fox-alpine.jpg",
          "title": "Alpine Meadow"
        },
        {
          "id": 9,
          "image": "/image_gallery/fox-family.jpg",
          "title": "Fox Family"
        }
      ]
    }
  },
  "children": [
    {
      "type": "div",
      "props": {
        "className": "gallery"
      },
      "children": [
        {
          "type": "Iterator",
          "props": {
            "dataArrField": "gallery"
          },
          "children": [
            {
              "type": "div",
              "props": {
                "className": "gallery-item"
              },
              "children": [
                {
                  "type": "Thumbnail",
                  "props": {
                    "srcField": "image"
                  }
                },
                {
                  "type": "BoxIC",
                  "props": {
                    "fieldNameIterator": "title",
                    "as": "div",
                    "className": "gallery-title"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Note:** For AI to have control over an application UI, it needs to control both its structure and its presentation. Zambool provides runtime control of the application UI structure through external JSON. Support for externally stored and loaded CSS is **TBD**.

### Code
The JSON drives the application. The supporting React components are registered with Zambool, and `ServerRenderer` renders the JSON.

#### Import Zambool

Import the Zambool renderer, data provider, iterator, and component-registration API.

```javascript
import {
  ServerRenderer,
  registerPlatformComponents,
  DataProviderGeneric,
  Iterator,
  useIterationData
} from 'zambool';
```

#### Define the leaf components
Zambool does not define the application's leaf components. These remain ordinary React components. Zambool provides hooks such as useIterationData to connect them to the data represented by the JSON.
```javascript
function BoxIC({
  as = "div",
  renderIf,
  className,
  fieldNameIterator,
  ...props
}) {
  const renderValue = useIterationData(renderIf ?? null);
  const fieldContent = useIterationData(fieldNameIterator);

  if (renderIf && !renderValue) {
    return null;
  }

  return React.createElement(
    as,
    {
      ...props,
      className,
    },
    fieldContent
  );
}

function Thumbnail({ srcField, className }) {
  const src = useIterationData(srcField);

  return (
    <img
      src={src}
      className={className}
    />
  );
}
```

#### Register the components
Components referenced by the JSON are registered with Zambool so that the renderer can resolve them.
```javascript
registerPlatformComponents({
  DataProviderGeneric,
  Iterator,
  BoxIC,
  Thumbnail,
});
```

#### Load and render the JSON
Load the application definition from an external JSON source and render it using `ServerRenderer`.
```javascript
export default async function Home() {
  const gallery = await fetchJSON("/content/gallery.json");

  return (
    <ServerRenderer tree={gallery} />
  );
}
```

## Installation

```bash
npm install zambool
```

## API

| API | Description |
|---|---|
| `DataProviderGeneric` | Provides application data to the client components in the component tree via hooks. In Next.js SSR, this is client-side data. It uses React Context to make the data available to client components. |
| `useData` | Accesses data provided by `DataProviderGeneric`, including fields and derived fields. |
| `useField` | Provides access to a data field together with a setter for updating its value. |
| `DataProviderExtensions` | Allows derived fields and field interceptors to be created on top of `DataProviderGeneric`. |
| `ServerDataApi` | Used in Next.js SSR. Provides the server-side data accessible to the server components in the component tree. Does not use React Context. |
| `Iterator` | Iterates over an array from the client data provider and renders its children for each item. Uses React Context to provide the iteration context. |
| `useIterationData` | Accesses a field from the item currently being rendered by an `Iterator`. |
| `useIterationField` | Accesses the current iteration value and provides a way to update it. |
| `useIterationIndex` | Returns the index of the current item within an `Iterator`. |
| `ServerIterator` | Iterates over server data. Does not use React Context. |
| `ServerRenderer` | Renders a JSON-defined application tree. It resolves registered components and HTML elements defined by the JSON. |
| `registerPlatformComponents` | Registers React client components that can be referenced by name from a JSON application definition. |
| `registerServerComponents` | Registers server components. |
| `registerJsonComponents` | Registers reusable blocks of JSON that can be referenced by name in an application definition. |