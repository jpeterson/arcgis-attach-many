# arcgis-attach-many
This tiny node app (using [Hapi](http://hapijs.com/)) accepts file uploads via `multipart/form-data` which can include
multiple files. These files are then sent as attachments to an ArcGIS Server feature.

For Example:
`<input type="file" multiple />`

## Why?
The ArcGIS Server Feature Service [`addAttachment`](http://server.arcgisonline.com/arcgis/sdk/rest/index.html#/Add_Attachment/02ss00000027000000/) endpoint only
accepts one file at a time. In many workflows, the ability to multiselect files
to be attached is desirable.

## Running the app
1. Clone or fork this repo
2. `npm install`
3. `npm start`
4. Point your web browser to `localhost:8080/test`

## Using the app
The app supports `content-type = multipart/form-data` POST requests only,
and requests must include the following parameters:

| parameter     | details |
|---------------|---------|
| `uploads`     | The name of the `<input>` element containing the files you wish to upload |
| `featureUrl`  | The URL of the feature to which you wish to attach the files              |

## Troubleshooting
Check out the HTML in `public/form.html` for a simple example.
