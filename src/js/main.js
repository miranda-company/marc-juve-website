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
            App.cons("Searching for featured projects");
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
    video: $(".project-video"),
    videoWrapper: $(".video-wrapper"),
    title: $(".project-title"),
    subtitle: $(".project-subtitle"),
    category: $(".project-category"),
    description: $(".about-text"),
    closeBtn: $(".close-btn"),

    init: function (projectID) {
        console.clear();
        this.id = projectID;
        this.getData();
        this.build();
    },

    getData: function () {
        // Search for projects to be featured
        App.cons("Searching for '" + Project.id + "' data");
        let results = DynamicData.search("projects", "id", Project.id);

        Project.data = results;
        App.cons("Found project data for " + Project.data[0]["title"]);
    },

    build: function () {
        Project.title.text(Project.data[0]["title"]);
        Project.subtitle.text(Project.data[0]["subtitle"]);
        Project.category.text(Project.data[0]["category"]);

        let videoSrc = Project.data[0]["videoUrl"];
        let vimeoOptions = "?autoplay=1&color=bb0207&title=0&byline=0&portrait=0";
        Project.video.attr("src", videoSrc + vimeoOptions);
        Project.videoWrapper.addClass(Project.data[0]["aspectRatio"]);

        Project.open();
    },

    open: function () {
        this.isOpen = true;
        window.scrollTo(0, 0);
        this.mainContainer.removeClass("display-none");
        this.closeBtn.on("click", this.closeHandler);

        // Project fade in
        gsap.to(".overlay", {
            duration: App.transitionSpeed, autoAlpha: 0
        });
    },

    closeHandler: function (event) {
        App.cons("Closing project");
        Project.mainContainer.addClass("display-none");
        Home.unfreeze();
        Project.videoWrapper.removeClass(Project.data[0]["aspectRatio"]);
        Project.isOpen = false;
        Project.data = null;
        Project.video.attr("src", "");

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
        App.cons("Searching inside '" + obj + "' > " + field + " > " + value);
        let results = [];
        let dynamicObject = DynamicData.data[obj];
        let searchField = field;
        let searchVal = value;

        for (let i = 0; i < dynamicObject.length; i++) {
            if (dynamicObject[i][searchField] == searchVal) {
                results.push(dynamicObject[i]);
            }
        }

        return results;
    }

}

window.onload = function () {
    DynamicData.init();
}