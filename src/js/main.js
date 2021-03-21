var App = {
    showConsole: true,
    transitionSpeed: 0.38,
    isDynamicData: false,

    init: function () {
        this.cons("App initialized, console is active");
        gsap.to(".overlay", { duration: App.transitionSpeed, autoAlpha: 0 });
        Home.init();
    },

    cons: function (msg) {
        this.showConsole ? console.log("- " + msg) : console.log("Console innactive");
    }
}

var Home = {
    mainContainer: $(".main-wrap"),
    isFrozen: false,

    init: function () {
        App.cons("Home initialized");
        this.featuredWork.init();
    },

    freeze: function () {
        Home.mainContainer.addClass("freeze display-none");
    },

    unfreeze: function () {
        Home.mainContainer.removeClass("freeze display-none");
    },

    featuredWork: {
        mainContainer: $("#js-featured-work"),
        grid: $("#featured-work-grid"),
        cardData: [],
        cards: null,

        init: function () {
            this.getData();
            this.buildCards();
            this.getCards();
            this.addCardListeners();
        },

        getData: function () {
            // Search for projects to be featured
            App.cons("Looking for work to be featured");
            let results = DynamicData.search("projects", "featured", true);

            Home.featuredWork.cardData = results;
            App.cons("Found " + Home.featuredWork.cardData.length + " projects to be featured");
        },

        buildCards: function () {
            App.cons("Building featured work grid");
            for (let i = 0; i < Home.featuredWork.cardData.length; i++) {
                let card = document.createElement("div");
                card.setAttribute("id", Home.featuredWork.cardData[i].id);
                card.className = "card fw-card";
                Home.featuredWork.grid.append(card);

                let cardContent = document.createElement("div");
                cardContent.className = "card-content";
                card.append(cardContent);

                let thumb = document.createElement("div");
                thumb.className = "thumb";
                cardContent.append(thumb);

                let thumbImg = document.createElement("img");
                thumbImg.className = "thumb-image";
                thumbImg.setAttribute("src", Home.featuredWork.cardData[i].thumbUrl);
                thumb.append(thumbImg);

                let cardOverlay = document.createElement("div");
                cardOverlay.className = "card-overlay";
                cardContent.append(cardOverlay);

                let cardTitle = document.createElement("h2");
                cardTitle.className = "card-title";
                cardTitle.innerHTML = Home.featuredWork.cardData[i].title;
                cardContent.append(cardTitle);

                let cardSubtitle = document.createElement("h3");
                cardSubtitle.className = "card-subtitle";
                cardSubtitle.innerHTML = Home.featuredWork.cardData[i].subtitle;
                cardContent.append(cardSubtitle);
            }
        },

        getCards: function () {
            Home.featuredWork.cards = $(".fw-card");
        },

        addCardListeners: function () {
            App.cons("Adding event listeners to " + Home.featuredWork.cardData.length + " featured work cards");
            $.each(Home.featuredWork.cards, function (i) {
                $(this).on("click", Home.featuredWork.cardHandler);
            });
        },

        cardHandler: function (event) {
            App.cons("FW card was clicked: " + this.id);
            let projectId = this.id;
            gsap.to(".overlay", {
                duration: App.transitionSpeed, autoAlpha: 1, onComplete: function () {
                    Home.freeze();
                    Project.init(projectId);
                }
            });
        }
    }
}

var Project = {
    id: null,
    data: null,
    isOpen: false,
    mainContainer: $(".project-wrap"),
    video: null,
    videoWrapper: null,
    title: $(".project-title"),
    subtitle: $(".project-subtitle"),
    category: $(".project-category"),
    description: $(".about-text"),
    closeBtn: $(".close-btn"),
    relatedWork: [],
    relatedWorkGrid: $("#related-work-grid"),
    relatedWorkCards: null,

    init: function (projectID) {
        console.clear();
        App.cons("Opening project...")
        this.id = projectID;
        this.video = $(".project-video");
        this.videoWrapper = $(".video-wrapper");

        this.getData();
        this.setData();

        // Checks if project has related work and get data
        if (Project.data[0].relatedWorkIDs.length > 1) {
            App.cons("Looking for " + Project.data[0].relatedWorkIDs.length + " related works");

            for (let i = 0; i < Project.data[0].relatedWorkIDs.length; i++) {
                Project.relatedWork.push(DynamicData.search("projects", "id", Project.data[0].relatedWorkIDs[i]));
                App.cons("Project related work id is: " + Project.relatedWork[i][0].title)
            }
            Project.buildCards();
        }

        this.open();
    },

    getData: function () {
        // Search for projects to be featured
        App.cons("Looking for '" + Project.id + "' data");
        let results = DynamicData.search("projects", "id", Project.id);;

        Project.data = results;
        App.cons("Found data for " + Project.data[0].title);

        let keys = Object.keys(Project.data[0]);
        App.cons("Object keys: " + keys);
    },

    setData: function () {
        App.cons("Page info has been changed");
        if (Project.data[0].videoUrl) {
            let videoSrc = Project.data[0].videoUrl;
            let vimeoOptions = "?autoplay=1&color=bb0207&title=0&byline=0&portrait=0";
            Project.video.attr("src", videoSrc + vimeoOptions);
            Project.videoWrapper.addClass(Project.data[0].aspectRatio);
        } else {
            Project.videoWrapper.css("display", "none");
        }

        if (Project.data[0].title) {
            Project.title.text(Project.data[0].title);
        } else {
            Project.title.css("display", "none");
        }

        if (Project.data[0].subtitle) {
            Project.subtitle.text(Project.data[0].subtitle);
        } else {
            Project.subtitle.css("display", "none");
        }

        if (Project.data[0].category) {
            Project.category.text(Project.data[0].category);
        } else {
            Project.category.css("display", "none");
        }

        if (Project.data[0].description) {
            Project.description.text(Project.data[0].description);
        } else {
            Project.description.css("display", "none");
        }
    },

    buildCards: function () {
        App.cons("Building related work cards");
        for (let i = 0; i < Project.relatedWork.length; i++) {
            var newCard = new Card(Project.relatedWorkGrid, Project.relatedWork[i][0].id, "related-work-card", Project.relatedWork[i][0].title, Project.relatedWork[i][0].subtitle, Project.relatedWork[i][0].thumbUrl);
            newCard.build();
        }

        this.getCards();
        this.addCardListeners();
    },

    getCards: function () {
        Project.relatedWorkCards = $(".related-work-card");
    },

    cleanRelatedWorkGrid() {
        $(".related-work-card").remove();
    },

    addCardListeners: function () {
        App.cons("Adding event listeners to " + Project.relatedWork.length + " related work cards");
        $.each(Project.relatedWorkCards, function (i) {
            $(this).on("click", Project.cardHandler);
        });
    },

    cardHandler: function (event) {
        App.cons("Related card was clicked: " + this.id);
        let projectId = this.id;

        gsap.to(".overlay", {
            duration: App.transitionSpeed, autoAlpha: 1, onComplete: function () {
                Project.reset();
                Project.init(projectId);
            }
        });
    },

    open: function () {
        App.cons("Project open: " + Project.data[0].title)
        this.isOpen = true;
        window.scrollTo(0, 0);
        this.mainContainer.removeClass("display-none");
        this.closeBtn.on("click", this.closeHandler);

        // Project fade in
        gsap.to(".overlay", {
            delay: 0.4, duration: App.transitionSpeed, autoAlpha: 0
        });
    },

    reset: function () {
        Project.closeBtn.off("click", this.closeHandler);
        Project.videoWrapper.removeClass(Project.data[0]["aspectRatio"]);
        Project.video.attr("src", "");
        Project.relatedWork = [];
        Project.cleanRelatedWorkGrid();
        Project.data = null;
    },

    closeHandler: function (event) {
        App.cons("Closing project");
        Project.reset();
        Project.mainContainer.addClass("display-none");
        Home.unfreeze();

        Project.isOpen = false;

        //Scroll back to Home > Featured Work
        var elmnToScrollTo = Home.featuredWork.mainContainer[0];
        elmnToScrollTo.scrollIntoView();
    }
}

var DynamicData = {
    data: null,

    init: function () {
        this.get();
    },

    get: function () {
        let requestURL = 'http://localhost:3000/js/dynamic-data.json';
        let request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();

        request.onload = function () {
            App.cons("Dynamic data was loaded correctly");
            DynamicData.data = request.response;
            App.init();
        }
    },

    search: function (obj, field, value) {
        App.cons("Searching... '" + obj + "' > " + field + " > " + value);
        let results = [];
        let dynamicObject = DynamicData.data[obj];
        let searchField = field;
        let searchVal = value;

        for (let i = 0; i < dynamicObject.length; i++) {
            if (dynamicObject[i][searchField] == searchVal) {
                results.push(dynamicObject[i]);
            }
        }

        // Return array of results
        return results;
    }
}

var Card = function (parentContainer, id, classSelector, title, subtitle, thumbUrl) {
    this.parentContainer = parentContainer;
    this.id = id;
    this.class = classSelector;
    this.title = title;
    this.subtitle = subtitle;
    this.thumbUrl = thumbUrl;
};

Card.prototype.build = function () {
    App.cons("Building card: " + this.id);
    let card = document.createElement("div");
    card.setAttribute("id", this.id);
    card.className = "card " + this.class;
    this.parentContainer.append(card);

    let cardContent = document.createElement("div");
    cardContent.className = "card-content";
    card.append(cardContent);

    let thumb = document.createElement("div");
    thumb.className = "thumb";
    cardContent.append(thumb);

    let thumbImg = document.createElement("img");
    thumbImg.className = "thumb-image";
    thumbImg.setAttribute("src", this.thumbUrl);
    thumb.append(thumbImg);

    let cardOverlay = document.createElement("div");
    cardOverlay.className = "card-overlay";
    cardContent.append(cardOverlay);

    let cardTitle = document.createElement("h2");
    cardTitle.className = "card-title";
    cardTitle.innerHTML = this.title;
    cardContent.append(cardTitle);

    let cardSubtitle = document.createElement("h3");
    cardSubtitle.className = "card-subtitle";
    cardSubtitle.innerHTML = this.subtitle;
    cardContent.append(cardSubtitle);
};


window.onload = function () {
    DynamicData.init();
}