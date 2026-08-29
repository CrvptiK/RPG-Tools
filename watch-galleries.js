/* same as generate-galleries, this is part 2, suggested by AI to automate gallery updates */
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");


const charactersFolder =
    path.join(__dirname, "characters");

const generator =
    path.join(__dirname, "generate-galleries.js");


let generationTimer = null;

function generateGalleries() {

    clearTimeout(generationTimer);


    generationTimer =
        setTimeout(
            function () {

                console.log("");
                console.log(
                    "Updating galleries..."
                );


                execFile(
                    process.execPath,
                    [generator],
                    function (
                        error,
                        stdout,
                        stderr
                    ) {

                        if (error) {

                            console.error(
                                "Gallery generation failed:"
                            );

                            console.error(
                                stderr
                            );

                            return;

                        }


                        process.stdout.write(
                            stdout
                        );


                        console.log(
                            "Galleries updated."
                        );

                    }
                );

            },
            300
        );

}


function isMedia(filename) {

    if (!filename) {

        return false;

    }


    const extension =
        path.extname(
            filename
        ).toLowerCase();


    return [

        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".avif",
        ".mp4"

    ].includes(
        extension
    );

}


function startWatcher() {

    console.log(
        "Watching:"
    );

    console.log(
        charactersFolder
    );

    console.log("");

    console.log(
        "Add or remove images inside"
    );

    console.log(
        "characters/*/images/"
    );

    console.log("");

    console.log(
        "Press Ctrl+C to stop."
    );

    console.log("");


    fs.watch(
        charactersFolder,
        {
            recursive: true
        },

        function (
            eventType,
            filename
        ) {

            if (!filename) {

                return;

            }


            const relativePath =
                filename.replace(
                    /\\/g,
                    "/"
                );


            console.log(
                "Change detected: " +
                relativePath
            );


            if (
                isMedia(relativePath)
            ) {

                generateGalleries();

            }

        }
    );

}



console.log(
    "================================="
);

console.log(
    " Character Gallery Watcher"
);

console.log(
    "================================="
);

console.log("");


generateGalleries();

startWatcher();