/* wtf was i thinking naming files character and characterS omfg, should i change it? probably. will i? i am too lazy so i fear not */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCharacters();

        setupCreationMenu();

    }
);



async function loadCharacters() {

    try {

        const response =
            await fetch("characters.json");


        if (!response.ok) {

            throw new Error(
                "Could not load characters.json. Status: "
                + response.status
            );

        }


        const data =
            await response.json();


        displayCharacters(
            data.characters || []
        );


    }

    catch (error) {

        console.error(
            "Character archive loading error:",
            error
        );

    }

}



function displayCharacters(characters) {

    const gallery =
        document.getElementById(
            "character-gallery"
        );


    const filter =
        document.getElementById(
            "keyword-filter"
        );


    gallery.innerHTML = "";

    filter.innerHTML = "";


    const keywords =
        collectKeywords(characters);


    createKeywordButtons(
        keywords,
        characters
    );


    characters.forEach(
        function (character) {

            const card =
                createCharacterCard(
                    character
                );


            gallery.appendChild(card);

        }
    );

}



function collectKeywords(characters) {

    const keywordSet =
        new Set();


    characters.forEach(
        function (character) {

            if (!character.keywords) {

                return;

            }


            character.keywords.forEach(
                function (keyword) {

                    keywordSet.add(
                        keyword
                    );

                }
            );

        }
    );


    return Array.from(
        keywordSet
    ).sort(
        function (a, b) {

            return a.localeCompare(b);

        }
    );

}



function createKeywordButtons(
    keywords,
    characters
) {

    const container =
        document.getElementById(
            "keyword-filter"
        );


    const allButton =
        document.createElement("button");


    allButton.textContent =
        "All";


    allButton.classList.add(
        "active"
    );


    allButton.addEventListener(
        "click",
        function () {

            filterCharacters(
                "all"
            );


            document
                .querySelectorAll(
                    ".keyword-filter button"
                )
                .forEach(
                    function (button) {

                        button.classList
                            .remove("active");

                    }
                );


            allButton.classList.add(
                "active"
            );

        }
    );


    container.appendChild(
        allButton
    );


    keywords.forEach(
        function (keyword) {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                keyword;


            button.addEventListener(
                "click",
                function () {

                    filterCharacters(
                        keyword
                    );


                    document
                        .querySelectorAll(
                            ".keyword-filter button"
                        )
                        .forEach(
                            function (button) {

                                button.classList
                                    .remove("active");

                            }
                        );


                    button.classList.add(
                        "active"
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* thank the gods for TUTORIALS */

function filterCharacters(keyword) {

    const cards =
        document.querySelectorAll(
            ".character-card"
        );


    cards.forEach(
        function (card) {

            if (keyword === "all") {

                card.classList.remove(
                    "hidden"
                );

                return;

            }


            const cardKeywords =
                card.dataset.keywords
                    .split("|");


            if (
                cardKeywords.includes(
                    keyword
                )
            ) {

                card.classList.remove(
                    "hidden"
                );

            }

            else {

                card.classList.add(
                    "hidden"
                );

            }

        }
    );

}



function createCharacterCard(
    character
) {

    const link =
        document.createElement("a");


    link.href =
        "characters/" +
        character.folder +
        "/character.html";


    link.classList.add(
        "character-card"
    );


    link.dataset.keywords =
        (character.keywords || [])
            .join("|");


    const image =
        document.createElement("img");


    image.src =
        character.portrait;


    image.alt =
        character.name;


    image.loading =
        "lazy";


    const overlay =
        document.createElement("div");


    overlay.classList.add(
        "overlay"
    );


    overlay.textContent =
        character.name;


    link.appendChild(
        image
    );


    link.appendChild(
        overlay
    );


    return link;

}



function setupCreationMenu() {

    const creationToggle =
        document.getElementById(
            "creation-toggle"
        );


    const creationMenu =
        document.getElementById(
            "creation-menu"
        );


    if (
        !creationToggle ||
        !creationMenu
    ) {

        return;

    }


    creationToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            creationMenu.classList.toggle(
                "open"
            );


            creationToggle.textContent =
                creationMenu.classList.contains(
                    "open"
                )
                ? "Creation -"
                : "Creation +";

        }
    );

}