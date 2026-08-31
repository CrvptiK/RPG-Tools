const fs = require("fs");
const path = require("path");


/* thank you, random guy on youtube */

const notesFolder =
    path.join(__dirname, "notes");

const charactersFolder =
    path.join(__dirname, "characters");

const templateFile =
    path.join(
        __dirname,
        "templates",
        "character.html"
    );

const homepage =
    path.join(
        __dirname,
        "index.html"
    );

const charactersJson =
    path.join(
        __dirname,
        "characters.json"
    );



console.log("");
console.log(" Character Website Builder");
console.log("");



if (!fs.existsSync(notesFolder)) {

    console.error(
        "Notes folder not found:"
    );

    console.error(notesFolder);

    process.exit(1);

}


if (!fs.existsSync(charactersFolder)) {

    fs.mkdirSync(
        charactersFolder,
        {
            recursive: true
        }
    );

}


if (!fs.existsSync(templateFile)) {

    console.error(
        "Character template not found:"
    );

    console.error(templateFile);

    process.exit(1);

}


if (!fs.existsSync(homepage)) {

    console.error(
        "index.html not found:"
    );

    console.error(homepage);

    process.exit(1);

}



const files =
    fs.readdirSync(notesFolder)
        .filter(
            function (file) {

                return path
                    .extname(file)
                    .toLowerCase() === ".md";

            }
        );


if (files.length === 0) {

    console.log(
        "no markdown files found."
    );

    process.exit(0);

}


console.log(
    "Found " +
    files.length +
    " Markdown file(s)."
);

console.log("");


files.forEach(
    function (file) {

        importCharacter(file);

    }
);


/* homepage and archive build */

generateHomepage();

generateCharacterArchive();

console.log("");
console.log(" Build complete!");
console.log(":)");
console.log("");


/* import char */

function importCharacter(file) {

    const filePath =
        path.join(
            notesFolder,
            file
        );


    const markdown =
        fs.readFileSync(
            filePath,
            "utf8"
        );


    const character =
        parseMarkdown(markdown);


    if (!character.name) {

        console.error(
            "Could not find character name in " +
            file
        );

        return;

    }


    const folderName =
        slugify(character.name);


    const characterFolder =
        path.join(
            charactersFolder,
            folderName
        );


    const imagesFolder =
        path.join(
            characterFolder,
            "images"
        );


    /* folder add */

    fs.mkdirSync(
        imagesFolder,
        {
            recursive: true
        }
    );


    /* make json */

    const jsonPath =
        path.join(
            characterFolder,
            "character.json"
        );


    fs.writeFileSync(

        jsonPath,

        JSON.stringify(
            character,
            null,
            4
        ),

        "utf8"

    );


    console.log(
        "Imported: " +
        character.name
    );


    console.log(
        "  - character.json"
    );



    let portraitFile =
        character.portrait;


    if (portraitFile) {

        const portraitPath =
            path.join(
                imagesFolder,
                portraitFile
            );


        if (
            fs.existsSync(portraitPath)
        ) {

            console.log(
                "  portrait: " +
                portraitFile
            );

        }
        else {

            console.log(
                "  stop, you violated the law : portrait not found: " +
                portraitFile
            );

            portraitFile = null;

        }

    }
    else {

        console.log(
            "  no portrait found"
        );

    }


    /* char html creation */

    const htmlPath =
        path.join(
            characterFolder,
            "character.html"
        );


   

    if (!fs.existsSync(htmlPath)) {

        let template =
            fs.readFileSync(
                templateFile,
                "utf8"
            );


      

        const portraitPath =
            portraitFile
                ? "images/" +
                  portraitFile

                : "../../images/placeholder.jpg";


      

        template =
            template.replace(
                'src="images/portrait.jpg"',
                'src="' +
                portraitPath +
                '"'
            );


        fs.writeFileSync(
            htmlPath,
            template,
            "utf8"
        );


        console.log(
            "  - character.html created"
        );

    }
    else {

        console.log(
            "  - character.html already exists"
        );

    }

}


function generateHomepage() {

    console.log("");
    console.log(
        "loading"
    );
    console.log("");


    const folders =
        fs.readdirSync(
            charactersFolder,
            {
                withFileTypes: true
            }
        )
        .filter(
            function (entry) {

                return entry.isDirectory();

            }
        );


    const characters = [];



    folders.forEach(
        function (folder) {

            const folderName =
                folder.name;


            const jsonPath =
                path.join(
                    charactersFolder,
                    folderName,
                    "character.json"
                );


            if (
                !fs.existsSync(jsonPath)
            ) {

                console.log(
                    "Skipped " +
                    folderName +
                    " (no character.json)"
                );

                return;

            }


            let character;


            try {

                character =
                    JSON.parse(
                        fs.readFileSync(
                            jsonPath,
                            "utf8"
                        )
                    );

            }

            catch (error) {

                console.error(
                    "Could not read " +
                    jsonPath
                );

                return;

            }


            const name =
                character.name ||
                "unknown";


            const portraitFile =
                character.portrait;


            const portrait =
                portraitFile

                    ? "characters/" +
                    folderName +
                    "/images/" +
                    portraitFile

                    : "images/placeholder.jpg";


            characters.push({

                name: name,

                folder: folderName,

                portrait: portrait

            });

        }
    );


    /* sorting */

    characters.sort(
        function (a, b) {

            return a.name.localeCompare(
                b.name
            );

        }
    );


    /* create character cards */

    const cards =
        characters.map(
            function (character) {

                return `

<a
    href="characters/${character.folder}/character.html"
    class="character-card"
>

    <img
        src="${character.portrait}"
        alt="${escapeHtml(character.name)}"
        loading="lazy"
    >

    <div class="overlay">
        ${escapeHtml(character.name)}
    </div>

</a>

`;

            }
        );


    const generatedGallery =
        `<!-- CHARACTER GALLERY START -->

${cards.join("\n")}

<!-- CHARACTER GALLERY END -->`;


    /* homepage pt1 */

    let html =
        fs.readFileSync(
            homepage,
            "utf8"
        );


    const startMarker =
        "<!-- CHARACTER GALLERY START -->";

    const endMarker =
        "<!-- CHARACTER GALLERY END -->";


    const startIndex =
        html.indexOf(startMarker);

    const endIndex =
        html.indexOf(endMarker);


    /* gallery */

    if (
        startIndex !== -1 &&
        endIndex !== -1
    ) {

        const endPosition =
            endIndex +
            endMarker.length;


        html =
            html.substring(
                0,
                startIndex
            ) +

            generatedGallery +

            html.substring(
                endPosition
            );

    }

    else {

        console.error(
            "Character gallery markers were not found."
        );

        console.error(
            "Add these to index.html:"
        );

        console.error("");

        console.error(
            "<!-- CHARACTER GALLERY START -->"
        );

        console.error(
            "<!-- CHARACTER GALLERY END -->"
        );

        process.exit(1);

    }


    /* homepage pt2 */

    fs.writeFileSync(
        homepage,
        html,
        "utf8"
    );


    console.log(
        "Homepage updated."
    );


    console.log(
        "Characters displayed: " +
        characters.length
    );

}

/* why not add a filter function i say, it will be fun i say, mother of- */

function generateCharacterArchive() {

    console.log("");
    console.log(
        "Updating character archive..."
    );
    console.log("");


    const folders =
        fs.readdirSync(
            charactersFolder,
            {
                withFileTypes: true
            }
        )
        .filter(
            function (entry) {

                return entry.isDirectory();

            }
        );


    const characters = [];


    folders.forEach(
        function (folder) {

            const folderName =
                folder.name;


            const jsonPath =
                path.join(
                    charactersFolder,
                    folderName,
                    "character.json"
                );


            if (
                !fs.existsSync(jsonPath)
            ) {

                console.log(
                    "Skipped " +
                    folderName +
                    " (no character.json)"
                );

                return;

            }


            let character;


            try {

                character =
                    JSON.parse(
                        fs.readFileSync(
                            jsonPath,
                            "utf8"
                        )
                    );

            }

            catch (error) {

                console.error(
                    "Could not read " +
                    jsonPath
                );

                return;

            }


            const name =
                character.name ||
                "unknown";


            const portraitFile =
                character.portrait;


            const portrait =
                portraitFile

                    ? "characters/" +
                      folderName +
                      "/images/" +
                      portraitFile

                    : "images/placeholder.jpg";


            characters.push({

                name:
                    name,

                folder:
                    folderName,

                portrait:
                    portrait,

                keywords:
                    character.keywords || []

            });

        }
    );



    characters.sort(
        function (a, b) {

            return a.name.localeCompare(
                b.name
            );

        }
    );


    const archiveData = {

        characters:
            characters

    };


    fs.writeFileSync(

        charactersJson,

        JSON.stringify(
            archiveData,
            null,
            4
        ),

        "utf8"

    );


    console.log(
        "characters.json updated."
    );


    console.log(
        "Characters in archive: " +
        characters.length
    );

}


/* parser for md */

function parseMarkdown(markdown) {

    const lines =
        markdown.split(/\r?\n/);


    const character = {

        name: "",

        portrait: "",

        age: "unknown",

        class: "unknown",

        lineage: "unknown",

        concept: "unknown",

        keywords: [],

        backstory: [],

        npcs: [],

        various: "fill"

    };


    let section = "";

    let currentChapter = null;

    let currentNpc = null;

    let currentVarious = "";

    let paragraphBuffer = [];


    function flushParagraph() {

        if (
            paragraphBuffer.length === 0
        ) {

            return;

        }


        const paragraph =
            paragraphBuffer
                .join("\n")
                .trim();


        if (!paragraph) {

            paragraphBuffer = [];

            return;

        }


        if (
            section === "backstory"
            &&
            currentChapter
        ) {

            currentChapter.paragraphs.push(
                markdownToHtml(paragraph)
            );

        }


        else if (
            section === "npcs"
            &&
            currentNpc
        ) {

            if (
                currentNpc.description
            ) {

                currentNpc.description +=
                    "\n\n";

            }


            currentNpc.description +=
                markdownToHtml(paragraph);

        }

        else if (
            section === "various"
        ) {

            if (
                character.various !== "fill"
            ) {

                character.various +=
                    "\n\n";

            }
            else {

                character.various = "";

            }


            character.various +=
                markdownToHtml(paragraph);

        }

        paragraphBuffer = [];

    }
    


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const originalLine =
            lines[i];


        const line =
            originalLine.trim();



        if (!line) {

            flushParagraph();

            continue;

        }


        /* H1 */

        if (
            line.startsWith("# ")
        ) {

            flushParagraph();


            character.name =
                line
                    .substring(2)
                    .trim();


            continue;

        }



        if (
            line.startsWith("## ")
        ) {

            flushParagraph();


            section =
                line
                    .substring(3)
                    .trim()
                    .toLowerCase();


            currentChapter = null;

            currentNpc = null;

            currentVarious = "";


            continue;

        }



        if (
            line.startsWith("### ")
        ) {

            flushParagraph();


            const title =
                line
                    .substring(4)
                    .trim();



            if (
                section === "backstory"
            ) {

                currentChapter = {

                    title:
                        markdownToHtml(title),

                    paragraphs: []

                };


                character.backstory.push(
                    currentChapter
                );


                continue;

            }


            if (
                section === "npcs"
            ) {

                currentNpc = {

                    name:
                        markdownToHtml(title),

                    description: ""

                };


                character.npcs.push(
                    currentNpc
                );


                continue;

            }

        }

        if (
        section === "portrait"
        ) {

        flushParagraph();

        character.portrait = line;

        continue;

        }



        if (
            section === "general"
            &&
            line.startsWith("- ")
        ) {

            flushParagraph();


            const value =
                line.substring(2);


            const separator =
                value.indexOf(":");


            if (
                separator !== -1
            ) {

                const key =
                    value
                        .substring(
                            0,
                            separator
                        )
                        .trim()
                        .toLowerCase();


                const content =
                    value
                        .substring(
                            separator + 1
                        )
                        .trim();


                if (
                    key === "age"
                ) {

                    character.age =
                        content;

                }

                else if (
                    key === "class"
                ) {

                    character.class =
                        content;

                }

                else if (
                    key === "lineage"
                ) {

                    character.lineage =
                        content;

                }

                else if (
                    key === "concept"
                ) {

                    character.concept =
                        content;

                }

            }


            continue;

        }



        if (
            section === "keywords"
            &&
            line.startsWith("- ")
        ) {

            flushParagraph();


            character.keywords.push(
                    line.substring(2).trim()
            );


            continue;

        }

        paragraphBuffer.push(line);

    }


    flushParagraph();


    return character;

}


/* md to html */

function markdownToHtml(text) {

    let result = text;


    /* esc */

    result =
        result
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            );



    result =
        result.replace(

            /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,

            '<a href="$2" target="_blank" rel="noopener">$1</a>'

        );


    result =
        result.replace(
            /\*\*(.+?)\*\*/g,
            "<strong>$1</strong>"
        );


    result =
        result.replace(
            /(?<!\*)\*([^*]+)\*(?!\*)/g,
            "<em>$1</em>"
        );



    result =
        result.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );

    result =
        result.replace(
            /\n/g,
            "<br>"
    );


    return result;

}


/* esc */

function escapeHtml(text) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* yt said to add slugs jk jk lmao */

function slugify(text) {

    return text

        .toLowerCase()

        .trim()

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-+|-+$/g,
            ""
        );

}