document.addEventListener("DOMContentLoaded", function () {

    loadCharacter();

});


/* we be loadin */

async function loadCharacter() {

    try {

        const response = await fetch("character.json");


        if (!response.ok) {

            throw new Error(
                "Could not load character.json. Status: "
                + response.status
            );

        }


        const character = await response.json();


        displayCharacter(character);

    }

    catch (error) {

        console.error(
            "Character loading error:",
            error
        );

    }

}


/* characterrr */

function displayCharacter(character) {

    document.title = character.name;


    /* at a glance */

    document.getElementById("character-name").textContent =
        character.name;


    document.getElementById("character-age").textContent =
        character.age;


    document.getElementById("character-class").textContent =
        character.class;


    document.getElementById("character-lineage").textContent =
        character.lineage;


    document.getElementById("character-concept").textContent =
        character.concept;


    /* other sections */

    displayPortrait(character);

    displayKeywords(character);

    displayBackstory(character);

    displayNPCs(character);

    displayVarious(character);

}


/* character portrait */

function displayPortrait(character) {

    const portrait =
        document.getElementById("character-portrait");


    if (!portrait) {

        return;

    }


    if (character.portrait) {

        portrait.src =
            "images/" +
            encodeURIComponent(character.portrait);

        portrait.alt =
            character.name;

    }

    else {

        portrait.src =
            "../../images/placeholder.jpg";

        portrait.alt =
            character.name +
            " portrait";

    }

}


/* keywords, sorting tba */

function displayKeywords(character) {

    const container =
        document.getElementById("character-keywords");


    container.innerHTML = "";


    if (!character.keywords) {
        return;
    }


    character.keywords.forEach(function (keyword) {

        const element =
            document.createElement("span");


        element.classList.add(
            "character-keyword"
        );


        element.textContent =
            keyword;


        container.appendChild(element);

    });

}

/* the pretty stuff */

const galleryToggle =
    document.getElementById("gallery-toggle");


const galleryContainer =
    document.getElementById("gallery-container");


let galleryLoaded = false;

let galleryMedia = [];

let currentImageIndex = 0;


if (galleryToggle && galleryContainer) {

    galleryToggle.addEventListener(
        "click",
        function () {

            galleryContainer.classList.toggle("open");


            if (
                galleryContainer.classList.contains("open")
                &&
                !galleryLoaded
            ) {

                loadGallery();

            }


            galleryToggle.textContent =
                galleryContainer.classList.contains("open")
                ? "Gallery -"
                : "Gallery +";

        }
    );

}


/* load gallery */

async function loadGallery() {

    try {

        const response =
            await fetch("gallery.json");


        if (!response.ok) {

            throw new Error(
                "Could not load gallery.json. Status: "
                + response.status
            );

        }


        const gallery =
            await response.json();


        galleryMedia =
            gallery.media || [];


        displayGallery();


        galleryLoaded = true;

    }

    catch (error) {

        console.error(
            "Gallery loading error:",
            error
        );


        galleryContainer.innerHTML =
            "<p>Could not load gallery.</p>";

    }

}


/* show gallery */

function displayGallery() {

    galleryContainer.innerHTML = "";


    if (galleryMedia.length === 0) {

        galleryContainer.innerHTML =
            "<p>No artwork has been added yet.</p>";

        return;

    }


    const grid =
        document.createElement("div");


    grid.classList.add(
        "gallery-grid"
    );


    galleryMedia.forEach(
        function (item, index) {

            const button =
                document.createElement("button");


            button.classList.add(
                "gallery-item"
            );


            button.type = "button";


            let media;


            /* vids */

            if (item.type === "video") {

                media =
                    document.createElement("video");


                media.src =
                    item.src;


                media.muted =
                    true;


                media.autoplay =
                    false;


                media.loop =
                    false;


                media.playsInline =
                    true;


                media.controls =
                    false;


                media.preload =
                    "metadata";


            }


            /* imgs */

            else {

                media =
                    document.createElement("img");


                media.loading =
                    "lazy";


                media.src =
                    item.src;


                media.alt =
                    "Character artwork " +
                    (index + 1);

            }


            button.appendChild(
                media
            );


            grid.appendChild(
                button
            );


            button.addEventListener(
                "click",
                function () {

                    openLightbox(index);

                }
            );

        }
    );


    galleryContainer.appendChild(
        grid
    );

}


/* light in ze box */

const lightbox =
    document.getElementById(
        "gallery-lightbox"
    );


const lightboxImage =
    document.getElementById(
        "lightbox-image"
    );


const lightboxVideo =
    document.getElementById(
        "lightbox-video"
    );


const lightboxClose =
    document.getElementById(
        "lightbox-close"
    );


const lightboxPrev =
    document.getElementById(
        "lightbox-prev"
    );


const lightboxNext =
    document.getElementById(
        "lightbox-next"
    );


function openLightbox(index) {

    if (
        !lightbox ||
        galleryMedia.length === 0
    ) {

        return;

    }


    currentImageIndex =
        index;


    updateLightbox();


    lightbox.classList.add(
        "open"
    );

}


function updateLightbox() {

    const item =
        galleryMedia[
            currentImageIndex
        ];


    if (!item) {

        return;

    }


    /* vids, ive been troubleshooting this bs for god knows how looong */

    if (item.type === "video") {

        lightboxImage.style.display = "none";
        lightboxImage.src = "";

        lightboxVideo.style.display = "block";


        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");


        lightboxVideo.controls = true;
        lightboxVideo.autoplay = false;
        lightboxVideo.muted = false;
        lightboxVideo.defaultMuted = false;
        lightboxVideo.volume = 1;
        lightboxVideo.playsInline = true;

        lightboxVideo.src = item.src;
        lightboxVideo.load();

    }


    /* img */

    else {

        lightboxVideo.pause();


        lightboxVideo.src =
            "";


        lightboxVideo.style.display =
            "none";


        lightboxImage.style.display =
            "block";


        lightboxImage.src =
            item.src;


        lightboxImage.alt =
            "Character artwork " +
            (currentImageIndex + 1);

    }

}


function closeLightbox() {

    lightbox.classList.remove(
        "open"
    );


    lightboxImage.src =
        "";


    lightboxVideo.pause();


    lightboxVideo.src =
        "";

}


/* skip back */

function showPreviousImage() {

    currentImageIndex--;


    if (
        currentImageIndex < 0
    ) {

        currentImageIndex =
            galleryMedia.length - 1;

    }


    updateLightbox();

}


/* skip forward */

function showNextImage() {

    currentImageIndex++;


    if (
        currentImageIndex >=
        galleryMedia.length
    ) {

        currentImageIndex =
            0;

    }


    updateLightbox();

}


/* i like me some buttons */

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


if (lightboxPrev) {

    lightboxPrev.addEventListener(
        "click",
        showPreviousImage
    );

}


if (lightboxNext) {

    lightboxNext.addEventListener(
        "click",
        showNextImage
    );

}


/* gey area interaction close thingy */

if (lightbox) {

    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* keyboard bc mouse exclusive sucks */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !lightbox ||
            !lightbox.classList.contains("open")
        ) {

            return;

        }


        if (
            event.key === "Escape"
        ) {

            closeLightbox();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            showPreviousImage();

        }


        if (
            event.key === "ArrowRight"
        ) {

            showNextImage();

        }

    }
);

lightboxVideo.addEventListener(
    "loadedmetadata",
    function () {

        lightboxVideo.currentTime = 0;

        lightboxVideo.muted = false;
        lightboxVideo.defaultMuted = false;
        lightboxVideo.volume = 1;

    }
);

/* the juicy backstory */

function displayBackstory(character) {

    const container =
        document.getElementById("backstory-container");


    container.innerHTML = "";


    if (!character.backstory) {
        return;
    }


    character.backstory.forEach(function (chapter) {

        /* container */

        const chapterElement =
            document.createElement("div");

        chapterElement.classList.add(
            "backstory-chapter"
        );


        /* titles im needlessly proud of */

        const title =
            document.createElement("h3");

        title.classList.add(
            "backstory-chapter-title"

        );

        title.textContent =
            chapter.title;

        /* the actual textssss */

        const content =
            document.createElement("div");

        content.classList.add(
            "backstory-chapter-content"
        );


        /* paragraphs */

        if (chapter.paragraphs) {

            chapter.paragraphs.forEach(function (text) {

                const paragraph =
                    document.createElement("p");

                paragraph.innerHTML = text;

                content.appendChild(paragraph);

            });

        }


        /* the stuff i forgot to add the first time around */

        chapterElement.appendChild(title);

        chapterElement.appendChild(content);

        container.appendChild(chapterElement);


        /* fold for me like a garden chair (or preferably easier than that) */

        title.addEventListener(
            "click",
            function () {

                content.classList.toggle("open");

            }
        );

    });

}


/* relevant side characters aka npcs */

function displayNPCs(character) {

    const container =
        document.getElementById("npc-container");


    container.innerHTML = "";


    if (!character.npcs) {
        return;
    }


    character.npcs.forEach(function (npc) {

        const card =
            document.createElement("div");


        card.classList.add(
            "npc-card"
        );


        const name =
            document.createElement("h3");


        name.innerHTML =
            npc.name;


        const description =
            document.createElement("p");


        description.innerHTML =
            npc.description;


        card.appendChild(name);

        card.appendChild(description);


        container.appendChild(card);

    });

}


/* stooooooof */

function displayVarious(character) {

    const container =
        document.getElementById(
            "misc-container"
        );


    container.innerHTML = "";


    if (
        !character.various ||
        character.various === "fill"
    ) {

        return;

    }


    const item =
        document.createElement("div");


    item.classList.add(
        "misc-item"
    );


    const text =
        document.createElement("div");


    text.classList.add(
        "misc-text"
    );


    const paragraphs =
        character.various.split(
            "\n\n"
        );


    paragraphs.forEach(
        function (paragraph) {

            const element =
                document.createElement("p");


            element.innerHTML =
                paragraph;


            text.appendChild(
                element
            );

        }
    );


    item.appendChild(
        text
    );


    container.appendChild(
        item
    );

}

/* creation menu */

const creationToggle =
    document.getElementById("creation-toggle");


const creationMenu =
    document.getElementById("creation-menu");


if (creationToggle && creationMenu) {

    creationToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            creationMenu.classList.toggle("open");

            if(creationMenu.classList.contains("open")){

                creationToggle.textContent = "Creation -";

            }else{

                creationToggle.textContent = "Creation +";

        }

        }
    );

}