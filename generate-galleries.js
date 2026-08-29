/* this was made following a tutorial created via AI because I couldnt find one in normal englishhh */


const fs = require("fs");
const path = require("path");


const charactersFolder =
    path.join(__dirname, "characters");


const mediaExtensions = [

    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".mp4"

];


const excludedImages = [

    "portrait.jpg",
    "portrait.jpeg",
    "portrait.png",
    "portrait.webp"

];


const characterFolders =
    fs.readdirSync(
        charactersFolder,
        { withFileTypes: true }
    );


characterFolders.forEach(
    function (entry) {

        if (!entry.isDirectory()) {

            return;

        }


        generateGallery(
            entry.name
        );

    }
);


function generateGallery(
    characterFolderName
) {

    const characterFolder =
        path.join(
            charactersFolder,
            characterFolderName
        );


    const imagesFolder =
        path.join(
            characterFolder,
            "images"
        );


    if (
        !fs.existsSync(imagesFolder)
    ) {

        console.log(
            "Skipping " +
            characterFolderName +
            " no images folder."
        );

        return;

    }


    const files =
        fs.readdirSync(imagesFolder);


    const media =
        files.filter(
            function (file) {

                const extension =
                    path.extname(
                        file
                    ).toLowerCase();


                return (
                    mediaExtensions.includes(
                        extension
                    )
                    &&
                    !excludedImages.includes(
                        file.toLowerCase()
                    )
                );

            }
        );


    media.sort(
        function (a, b) {

            return a.localeCompare(
                b,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );

        }
    );


    const mediaItems =
        media.map(
            function (file) {

                const extension =
                    path.extname(
                        file
                    ).toLowerCase();


                const type =
                    extension === ".mp4"
                        ? "video"
                        : "image";


                return {

                    type:
                        type,

                    src:
                        "images/" + file

                };

            }
        );


    const galleryData = {

        media:
            mediaItems

    };


    const outputPath =
        path.join(
            characterFolder,
            "gallery.json"
        );


    fs.writeFileSync(

        outputPath,

        JSON.stringify(
            galleryData,
            null,
            4
        ),

        "utf8"

    );


    console.log(
        "Generated gallery for " +
        characterFolderName +
        " (" +
        media.length +
        " media files)"
    );

}