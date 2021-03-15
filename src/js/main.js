var App = {
    showConsole: true,
    transitionSpeed: 0.38,
    dynamicData: null,

    init: function () {
        this.cons("App initialized, console is active");
        this.getDynamicData();

    },

    cons: function (msg) {
        this.showConsole ? console.log("- " + msg) : console.log("Console innactive");
    },

    getDynamicData: function () {
        let requestURL = 'http://localhost:3000/js/dynamic-data.json';
        let request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();

        request.onload = function () {
            App.cons("JSON load complete");
            App.dynamicData = request.response;
            Home.init();
        }
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
        cardsDynamicData: [],

        init: function () {
            this.populate.search();
        },

        addCardListeners: function () {
            App.cons("Adding event listeners to FW cards" + Home.featuredWork.cardsDynamicData.length);
            $.each($(".js-fw-card"), function (i) {
                $(this).on("click", Home.featuredWork.cardHandler);
            });
        },

        populate: {
            search: function () {
                App.cons("Searching for featured projects");
                let dynamicData = App.dynamicData["projects"];
                let results = [];
                let searchField = "featured";
                let searchVal = true;

                for (let i = 0; i < dynamicData.length; i++) {
                    if (dynamicData[i][searchField] == searchVal) {
                        results.push(dynamicData[i]);
                    }
                }

                Home.featuredWork.cardsDynamicData = results;
                App.cons("Found " + Home.featuredWork.cardsDynamicData.length + " projects to be featured");
                this.build();
            },

            build: function () {
                App.cons("Building featured work grid");
                for (let i = 0; i < Home.featuredWork.cardsDynamicData.length; i++) {
                    let card = document.createElement("div");
                    card.setAttribute("id", Home.featuredWork.cardsDynamicData[i].id);
                    card.className = "card js-fw-card";
                    Home.featuredWork.grid.append(card);

                    let cardContent = document.createElement("div");
                    cardContent.className = "card-content";
                    card.append(cardContent);

                    let thumb = document.createElement("div");
                    thumb.className = "thumb";
                    cardContent.append(thumb);

                    let thumbImg = document.createElement("img");
                    thumbImg.className = "thumb-image";
                    thumbImg.setAttribute("src", Home.featuredWork.cardsDynamicData[i].thumbUrl);
                    thumb.append(thumbImg);

                    let cardOverlay = document.createElement("div");
                    cardOverlay.className = "card-overlay";
                    cardContent.append(cardOverlay);

                    let cardTitle = document.createElement("h2");
                    cardTitle.className = "card-title";
                    cardTitle.innerHTML = Home.featuredWork.cardsDynamicData[i].title;
                    cardContent.append(cardTitle);

                    let cardSubtitle = document.createElement("h3");
                    cardSubtitle.className = "card-subtitle";
                    cardSubtitle.innerHTML = Home.featuredWork.cardsDynamicData[i].subtitle;
                    cardContent.append(cardSubtitle);
                }
                Home.featuredWork.addCardListeners();
            }
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
        this.id = projectID;
        this.populate.search();
    },

    populate: {
        search: function () {
            let dynamicData = App.dynamicData['projects'];
            App.cons("Searching for '" + Project.id + "' inside dynamic data");
            let results = [];
            let searchField = "id";
            let searchVal = Project.id;

            for (let i = 0; i < dynamicData.length; i++) {
                if (dynamicData[i][searchField] == searchVal) {
                    results.push(dynamicData[i]);
                    Project.data = dynamicData[i];
                    App.cons("Project '" + Project.data.id + "' was found and has been populated");
                }
            }

            this.assign();
        },

        assign: function () {
            Project.title.text(Project.data.title);
            Project.subtitle.text(Project.data.subtitle);
            Project.category.text(Project.data.category);

            var videoSrc = Project.data.videoUrl;
            var vimeoOptions = "?autoplay=1&color=bb0207&title=0&byline=0&portrait=0";
            Project.video.attr("src", videoSrc + vimeoOptions);
            Project.videoWrapper.addClass(Project.data.aspectRatio);

            Project.open();
        },

    },

    open: function () {
        this.isOpen = true;
        window.scrollTo(0, 0);
        this.mainContainer.removeClass("display-none");
        this.closeBtn.on("click", this.closeHandler);

        // Fade in
        gsap.to(".overlay", {
            duration: App.transitionSpeed, autoAlpha: 0
        });
    },

    closeHandler: function (event) {
        App.cons("Closing project");
        Project.mainContainer.addClass("display-none");
        Home.unfreeze();
        Project.videoWrapper.removeClass(Project.data.aspectRatio);
        Project.isOpen = false;
        Project.data = null;
        Project.video.attr("src", "");

        var elmnToScrollTo = Home.featuredWork.mainContainer[0];
        elmnToScrollTo.scrollIntoView();
    }
}

window.onload = function () {
    App.init();
    gsap.to(".overlay", { duration: App.transitionSpeed, autoAlpha: 0 });
}