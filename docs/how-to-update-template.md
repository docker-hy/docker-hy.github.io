## How to update the template

To update a course using this repository as a template, simply execute the script `update-material-template.sh` found in this repository's bin-directory.

The script takes a single parameter, the path to the directory of the course that's updated.

The script updates the following parts in the target directory:

- src-directory
- plugins-directory
- docs-directory
- all files beginning with `gatsby-`
- all files beginning with `package`

Note, that you might have to manually update some files (such as course-settings.js), if needed.
