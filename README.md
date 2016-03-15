# arcgis-attach-many
This tiny node app accepts file uploads via `multipart/form-data` which can include
multiple files using

`<input type="file" name="uploads" name="uploads" multiple />`

## Why?
ArcGIS Server Feature Services `addAttachment` endpoint only
accept one file at a time. In many workflows, the ability to multiselect files
to be attached is desirable.

## Running the app
1. Clone or fork this repo
2. `npm install`
3. `npm start`
4. Open a web browser to `localhost:8080/test`

## Using the app
The app supports `content-type = multipart/form-data` POST requests only,
and requests must include the following parameters:

| parameter     | details |
|---------------|---------|
| `uploads`     | The name of the `<input>` element containing the files you wish to upload |
| `featureUrl`  | The URL of the Feature you wish to attach files to         |

## Troubleshooting
Check out the HTML in `test/form.html` for a simple example.
