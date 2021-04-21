// Scroll Trigger
gsap.registerPlugin(ScrollTrigger);

var App = {
    showConsole: true,
    transitionSpeed: 0.6,
    isDynamicData: false,

    init: function () {
        this.cons("App initialized, console is active");
        Home.init();
    },

    cons: function (msg) {
        if (this.showConsole) {
            console.log("- " + msg);
        }
    },

    forceResize: function () {
        // For a full list of event types: https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
        let el = document; // This can be your element on which to trigger the event
        let event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        el.dispatchEvent(event);
    }
}

var Home = {
    mainContainer: $(".main-wrap"),
    isFrozen: false,
    archiveVisible: true,
    heroVideo: null,

    init: function () {
        App.cons("Home initialized");
        this.featuredWork.init();
        if (this.archiveVisible) {
            this.archive.init();
        }
        gsap.to("#page-overlay-1", { duration: App.transitionSpeed, autoAlpha: 0 });
        gsap.to("#page-overlay-2", { duration: App.transitionSpeed, opacity: 0 });
        gsap.to("#end-text", { duration: App.transitionSpeed, opacity: 0, y: 100 });
    },

    freeze: function () {
        Home.mainContainer.addClass("freeze display-none");
    },

    unfreeze: function () {
        Home.mainContainer.removeClass("freeze display-none");
        gsap.set([".card-title", ".card-subtitle"], { css: { color: "#000000" } });
    },

    featuredWork: {
        mainContainer: $("#js-featured-work"),
        grid: $("#featured-work-grid"),
        cardData: [],
        cards: null,
        filterBtns: null,

        init: function () {
            this.getData();
            this.buildCards();
            this.filterBtns = $(".filter-fw-btn");
            this.addFilterListeners();
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
                var newCard = new Card(Home.featuredWork.grid, Home.featuredWork.cardData[i].id, "fw-card", Home.featuredWork.cardData[i].featuredThumbTitle, Home.featuredWork.cardData[i].featuredThumbSubtitle, Home.featuredWork.cardData[i].categoryFilter, Home.featuredWork.cardData[i].thumbUrl);
                newCard.build();
            }

            this.getCards();
            this.addCardListeners();
        },

        getCards: function () {
            Home.featuredWork.cards = $(".fw-card");
            gsap.set([".thumb-image"], { scale: 1 });
            gsap.set([".card-overlay", ".card-title", ".card-subtitle"], { opacity: 0 });
            gsap.set([".card-title", ".card-subtitle"], { css: { color: "#000000" } });
        },

        filterHandler: function (event) {
            App.cons("Filter btn clicked " + this.id);
            let filter = this.id;

            Home.featuredWork.cards.addClass("hide");
            $(".filter-fw-btn").removeClass("selected");
            $("#fw-filter-buttons").find("#" + filter).addClass("selected");

            if (filter == "all") {
                Home.featuredWork.cards.removeClass("hide");
            }

            if (filter == "commercials") {
                $("." + filter).removeClass("hide");
            }

            if (filter == "film-and-tv-series") {
                $("." + filter).removeClass("hide");
            }

            if (filter == "music-videos") {
                $("." + filter).removeClass("hide");
            }

        },

        addFilterListeners: function () {
            App.cons("Adding events to filters");
            $.each(Home.featuredWork.filterBtns, function (i) {
                $(this).on("click", Home.featuredWork.filterHandler);
            });
        },

        addCardListeners: function () {
            App.cons("Adding event listeners to " + Home.featuredWork.cardData.length + " featured work cards");
            $.each(Home.featuredWork.cards, function (i) {
                $(this).on("click", Home.featuredWork.cardHandler);
                $(this).on("mouseenter", Home.featuredWork.hoverHandler);
                $(this).on("mouseleave", Home.featuredWork.outHandler);
            });
        },

        hoverHandler: function (event) {
            let cardOverlay = $(this).find(".card-overlay");
            let cardTitle = $(this).find(".card-title");
            let cardSubtitle = $(this).find(".card-subtitle");
            let thumbImage = $(this).find(".thumb-image");
            gsap.set([cardOverlay, cardTitle, cardSubtitle], { autoAlpha: 0 });
            gsap.to([cardOverlay], { duration: 0.4, autoAlpha: 1, ease: Power1.easeInOut, overwrite: true });
            gsap.to([cardTitle, cardSubtitle], { duration: 0.8, autoAlpha: 1, ease: Power1.easeInOut, overwrite: true });
            gsap.to([thumbImage], { duration: 0.4, scale: 1.02, overwrite: true });
        },

        outHandler: function (event) {
            let cardOverlay = $(this).find(".card-overlay");
            let cardTitle = $(this).find(".card-title");
            let cardSubtitle = $(this).find(".card-subtitle");
            let thumbImage = $(this).find(".thumb-image");

            gsap.to([cardOverlay, cardTitle, cardSubtitle], { autoAlpha: 0, overwrite: true });
            gsap.to([thumbImage], { scale: 1, overwrite: true });
        },

        cardHandler: function (event) {
            App.cons("FW card was clicked: " + this.id);
            let projectId = this.id;
            gsap.to("#page-overlay-1", {
                duration: App.transitionSpeed, autoAlpha: 1, onComplete: function () {
                    Home.freeze();
                    Project.init(projectId);
                }
            });
        }
    },

    archive: {
        mainContainer: $("#js-archive"),
        grid: $("#archive-grid"),
        cardData: [],
        cards: null,
        filterBtns: null,

        init: function () {
            this.getData();
            this.buildCards();
            this.filterBtns = $(".filter-archive-btn");
            this.addFilterListeners();
        },

        getData: function () {
            // Search for projects to be featured
            App.cons("Looking for work to be displayed in the archive");
            let results = DynamicData.search("projects", "featured", false);

            Home.archive.cardData = results;
            App.cons("Found " + Home.archive.cardData.length + " projects to be featured");
        },

        buildCards: function () {
            App.cons("Building featured work grid");
            for (let i = 0; i < Home.archive.cardData.length; i++) {
                var newCard = new Card(Home.archive.grid, Home.archive.cardData[i].id, "archive-card", Home.archive.cardData[i].title, Home.archive.cardData[i].subtitle, Home.archive.cardData[i].categoryFilter, Home.archive.cardData[i].thumbUrl);
                newCard.build();
            }

            this.getCards();
            this.addCardListeners();
        },

        getCards: function () {
            Home.archive.cards = $(".archive-card");
            gsap.set([".thumb-image"], { scale: 1 });
            gsap.set([".card-overlay", ".card-title", ".card-subtitle"], { opacity: 0 });
        },

        filterHandler: function (event) {
            App.cons("Filter btn clicked " + this.id);
            let filter = this.id;

            Home.archive.cards.addClass("hide");
            $(".filter-archive-btn").removeClass("selected");
            $("#archive-filter-buttons").find("#" + filter).addClass("selected");

            if (filter == "all") {
                Home.archive.cards.removeClass("hide");
            }

            if (filter == "commercials") {
                $("." + filter).removeClass("hide");
            }

            if (filter == "film-and-tv-series") {
                $("." + filter).removeClass("hide");
            }

            if (filter == "music-videos") {
                $("." + filter).removeClass("hide");
            }

        },

        addFilterListeners: function () {
            App.cons("Adding events to filters");
            $.each(Home.archive.filterBtns, function (i) {
                $(this).on("click", Home.archive.filterHandler);
            });
        },

        addCardListeners: function () {
            App.cons("Adding event listeners to " + Home.archive.cardData.length + " featured work cards");
            $.each(Home.archive.cards, function (i) {
                $(this).on("click", Home.archive.cardHandler);
                $(this).on("mouseenter", Home.archive.hoverHandler);
                $(this).on("mouseleave", Home.archive.outHandler);
            });
        },

        hoverHandler: function (event) {
            let cardOverlay = $(this).find(".card-overlay");
            let cardTitle = $(this).find(".card-title");
            let cardSubtitle = $(this).find(".card-subtitle");
            let thumbImage = $(this).find(".thumb-image");
            gsap.set([cardOverlay, cardTitle, cardSubtitle], { autoAlpha: 0 });
            gsap.to([cardOverlay], { duration: 0.4, autoAlpha: 1, ease: Power1.easeInOut, overwrite: true });
            gsap.to([cardTitle, cardSubtitle], { duration: 0.8, autoAlpha: 1, ease: Power1.easeInOut, overwrite: true });
            gsap.to([thumbImage], { duration: 0.4, scale: 1.02, overwrite: true });
        },

        outHandler: function (event) {
            let cardOverlay = $(this).find(".card-overlay");
            let cardTitle = $(this).find(".card-title");
            let cardSubtitle = $(this).find(".card-subtitle");
            let thumbImage = $(this).find(".thumb-image");

            gsap.to([cardOverlay, cardTitle, cardSubtitle], { autoAlpha: 0, overwrite: true });
            gsap.to([thumbImage], { scale: 1, overwrite: true });
        },

        cardHandler: function (event) {
            App.cons("Archive card was clicked: " + this.id);
            let projectId = this.id;
            gsap.to("#page-overlay-1", {
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
    videoSection: null,
    videoWrapper: null,
    vimeoPlayer: null,
    videoPosterContainer: null,
    videoPosterImage: null,
    videoPlayBtn: null,
    title: null,
    subtitle: null,
    clientProject: null,
    category: null,
    role: null,
    description: null,
    festivalsSection: null,
    festivals: null,
    posterSection: null,
    posterImage: null,
    pressKitSection: null,
    pressKitAnchorTag: null,
    rwSection: null,
    rwGrid: null,
    rwCards: null,
    relatedWork: [],
    closeBtn: $(".close-btn"),
    endSection: null,
    endSectionPos: null,

    init: function (projectID) {
        console.clear();
        App.cons("Opening project...")
        this.id = projectID;

        this.videoSection = $(".project-hero-video");
        this.videoWrapper = $(".video-wrapper");
        this.videoPosterContainer = $("#video-poster-container");
        this.videoPosterImage = $("#video-poster-image");
        this.videoPlayBtn = $("#video-play-btn");
        this.title = $(".project-title");
        this.subtitle = $(".project-subtitle");
        this.clientProject = $(".project-client");
        this.category = $(".project-category");
        this.role = $(".role");
        this.description = $(".description");
        this.festivalsSection = $(".project-festivals");
        this.festivals = $(".festivals");
        this.posterSection = $(".project-poster");
        this.posterImage = $(".poster-image");
        this.pressKitSection = $(".project-press-kit");
        this.pressKitAnchorTag = $(".press-kit-anchor-tag");
        this.rwSection = $(".project-related");
        this.rwGrid = $(".related-work-grid");
        this.endSection = $("#project-end-section");

        this.getData();
        this.setData();

        // Add event listener to play button
        this.videoPlayBtn.on("click", Project.playVideo);

        // Check if project has related work and get data
        if (Project.data[0].relatedWorkIDs.length > 0) {
            App.cons("Looking for " + Project.data[0].relatedWorkIDs.length + " related works");

            for (let i = 0; i < Project.data[0].relatedWorkIDs.length; i++) {
                Project.relatedWork.push(DynamicData.search("projects", "id", Project.data[0].relatedWorkIDs[i]));
                App.cons("Project related work id is: " + Project.relatedWork[i][0].title)
            }
            Project.buildCards();
        }

        this.open();

        // Force window resize before adding the ScrollTriggers. This calculates the position of project-end-section
        App.forceResize();
        this.addScrollTriggers();
    },

    playVideo: function () {
        App.cons("Playing project's video");

        Project.videoPosterContainer.addClass("display-none");
        Project.vimeoPlayer.play();
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

        // Replace video info
        if (Project.data[0].vimeoID) {
            let vimeoOptions = {
                id: Project.data[0].vimeoID,
                loop: false,
                autoPlay: false,
                windth: "",
                height: ""
            }

            // let vimeoPlayer = new Vimeo.Player("js-vimeo-player", vimeoOptions);
            Project.vimeoPlayer = new Vimeo.Player("js-vimeo-player", vimeoOptions);

            // vimeoPlayer.play();
            Project.vimeoPlayer.on("play", function () {
                App.cons("Project video is playing");
            });

            Project.videoWrapper.addClass(Project.data[0].aspectRatio);
            Project.videoSection.removeClass("display-none");
        } else {
            Project.videoSection.addClass("display-none");
        }

        // Replace video poster
        if (Project.data[0].videoPosterUrl) {
            Project.videoPosterImage.attr("src", Project.data[0].videoPosterUrl);
            Project.videoPosterImage.removeClass("display-none");
        } else {
            Project.videoPosterImage.addClass("display-none");
            Project.videoPosterImage.attr("src", "");
        }

        // Replace title info
        if (Project.data[0].title) {
            Project.title.text(Project.data[0].title);
            Project.title.removeClass("display-none");
        } else {
            Project.title.addClass("display-none");
            Project.title.html("");
        }

        // Replace subtitle info
        if (Project.data[0].subtitle) {
            Project.subtitle.text(Project.data[0].subtitle);
            Project.subtitle.removeClass("display-none");
        } else {
            Project.subtitle.addClass("display-none");
            Project.subtitle.html("");
        }

        // Replace client/project info
        if (Project.data[0].clientProject) {
            Project.clientProject.text(Project.data[0].clientProject);
            Project.clientProject.removeClass("display-none");
        } else {
            Project.clientProject.addClass("display-none");
            Project.clientProject.html("");
        }

        // Replace category text info
        if (Project.data[0].categoryText) {
            Project.category.text(Project.data[0].categoryText);
        } else {
            Project.category.addClass("display-none");
            Project.category.html("");
        }

        // Replace role info
        if (Project.data[0].role) {
            Project.role.text(Project.data[0].role);
            Project.role.removeClass("display-none");
        } else {
            Project.role.addClass("display-none");
            Project.role.html("");
        }

        // Replace description info
        if (Project.data[0].description) {
            Project.description.text(Project.data[0].description);
            Project.description.removeClass("display-none");
        } else {
            Project.description.addClass("display-none");
            Project.description.addClass("");
        }

        // Replace festivals info
        if (Project.data[0].festivals.length) {
            for (var i = 0; i < Project.data[0].festivals.length; i++) {
                App.cons("Building festival list");
                let ul = document.createElement("ul");
                Project.festivals.append(ul);

                let li = document.createElement("li");
                li.className = "festival";
                li.innerHTML = Project.data[0].festivals[i];
                ul.append(li);
            }

            Project.festivalsSection.removeClass("display-none");
        } else {
            Project.festivalsSection.addClass("display-none");
        }

        // Replace poster info
        if (Project.data[0].posterUrl) {
            Project.posterImage.attr("src", Project.data[0].posterUrl);
            Project.posterSection.removeClass("display-none");
        } else {
            Project.posterSection.addClass("display-none");
            Project.posterImage.attr("src", "");
        }

        // Replace press kit info
        if (Project.data[0].pressKitUrl) {
            Project.pressKitAnchorTag.attr("src", Project.data[0].pressKitUrl);
            Project.pressKitSection.removeClass("display-none");
        } else {
            Project.pressKitSection.addClass("display-none");
            Project.pressKitAnchorTag.attr("src", "");
        }
    },

    buildCards: function () {
        App.cons("Building related work cards");
        for (let i = 0; i < Project.relatedWork.length; i++) {
            var newCard = new Card(Project.rwGrid, Project.relatedWork[i][0].id, "related-work-card", Project.relatedWork[i][0].title, Project.relatedWork[i][0].subtitle, Project.relatedWork[i][0].categoryFilter, Project.relatedWork[i][0].thumbUrl);
            newCard.build();
        }

        this.getCards();
        this.addCardListeners();
    },

    getCards: function () {
        Project.rwCards = $(".related-work-card");
        gsap.set([".card-overlay"], { autoAlpha: 0 });
        gsap.set([".card-title", ".card-subtitle"], { css: { color: "#ffffff" } });
    },

    addCardListeners: function () {
        App.cons("Adding event listeners to " + Project.relatedWork.length + " related work cards");
        $.each(Project.rwCards, function (i) {
            $(this).on("click", Project.cardHandler);
            $(this).on("mouseenter", Project.hoverHandler);
            $(this).on("mouseleave", Project.outHandler);
        });
    },

    hoverHandler: function (event) {
        let cardOverlay = $(this).find(".card-overlay");
        let cardTitle = $(this).find(".card-title");
        let cardSubtitle = $(this).find(".card-subtitle");
        let thumbImage = $(this).find(".thumb-image");
        gsap.set([cardOverlay], { autoAlpha: 0 });
        gsap.to([cardOverlay], { duration: 0.4, autoAlpha: 1, ease: Power1.easeInOut });
        gsap.to([cardTitle, cardSubtitle], { delay: 0.2, duration: 0.8, css: { color: "#000000" }, ease: Power1.easeInOut });
        gsap.to([thumbImage], { duration: 0.4, scale: 1.02 });
    },

    outHandler: function (event) {
        let cardOverlay = $(this).find(".card-overlay");
        let cardTitle = $(this).find(".card-title");
        let cardSubtitle = $(this).find(".card-subtitle");
        let thumbImage = $(this).find(".thumb-image");
        gsap.to([cardOverlay], { autoAlpha: 0, overwrite: true });
        gsap.to([cardTitle, cardSubtitle], { css: { color: "#ffffff" } });
        gsap.to([thumbImage], { scale: 1, overwrite: true });
    },

    cardHandler: function (event) {
        App.cons("Related card was clicked: " + this.id);
        let projectId = this.id;

        gsap.to("#page-overlay-1", {
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
        gsap.to("#page-overlay-1", {
            delay: 0.4, duration: App.transitionSpeed, autoAlpha: 0
        });
    },

    reset: function () {
        Project.closeBtn.off("click", this.closeHandler);
        Project.videoWrapper.removeClass(Project.data[0]["aspectRatio"]);
        Project.relatedWork = [];
        $(".related-work-card").remove();
        $(".festival").remove();
        Project.data = null;
        Project.endSection = null;
        Project.endSectionPos = null;
        ScrollTrigger.getById("pinCloseBtn").kill(true);
        ScrollTrigger.getById("projectEnd").kill(true);

        Project.videoPosterContainer.removeClass("display-none");

        // Remove vimeo player
        Project.vimeoPlayer.destroy().then(function () {
            // the player was destroyed
        }).catch(function (error) {
            // an error occurred
        });
    },

    closeHandler: function (event) {
        App.cons("Closing project");
        Project.reset();
        Project.mainContainer.addClass("display-none");
        Home.unfreeze();
        gsap.set("#page-overlay-1", { autoAlpha: 1 });
        gsap.to("#page-overlay-1", { duration: 0.8, autoAlpha: 0 });

        Project.isOpen = false;

        //Scroll back to Home > Featured Work
        let elmnToScrollTo = Home.featuredWork.mainContainer[0];
        elmnToScrollTo.scrollIntoView();
    },

    addScrollTriggers: function () {
        // Pin close button when scrolls down
        gsap.to(Project.closeBtn, {
            scrollTrigger: {
                id: "pinCloseBtn",
                trigger: ".close-btn-section",
                start: "top top",
                endTrigger: Project.endSection,
                end: "top 10%",
                pinSpacing: false,
                pin: true,
                // markers: true
            }
        });

        // Fade project when scrolled all the way down
        gsap.to("#end-text", {
            scrollTrigger: {
                id: "projectEnd",
                trigger: Project.endSection,
                toggleActions: "play none none reset",
                start: "top 10%",
                end: "top 10%",
                // markers: true
            },
            duration: 0.6,
            opacity: 1,
            y: 0
        });

        gsap.to("#end-indicator", {
            scrollTrigger: {
                id: "projectEnd",
                trigger: Project.endSection,
                toggleActions: "play none none reset",
                start: "top 10%",
                end: "top 10%",
                // markers: true
            },
            delay: 0.6,
            duration: 0.8,
            rotation: 0
        });

        gsap.to("#page-overlay-2", {
            scrollTrigger: {
                id: "projectEnd",
                trigger: Project.endSection,
                toggleActions: "play none none reset",
                start: "top 10%",
                end: "top 10%",
                // markers: true
            },
            delay: 1.2,
            duration: 0.6,
            opacity: 1,
            onComplete: Project.closeHandler
        });
    }
}

var DynamicData = {
    data: null,

    init: function () {
        this.get();
    },

    get: function () {
        // Dynamic data on local machine
        let requestURL = 'http://localhost:3000/js/dynamic-data.json';

        //Dynamic data live server
        // let requestURL = 'https://www.labaula.net/terrenodepruebas/crisantemo/js/dynamic-data.json';

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

var Card = function (parentContainer, id, classSelector, title, subtitle, category, thumbUrl) {
    this.parentContainer = parentContainer;
    this.id = id;
    this.class = classSelector;
    this.title = title;
    this.subtitle = subtitle;
    this.category = category;
    this.thumbUrl = thumbUrl;
};

Card.prototype.build = function () {
    App.cons("Building card: " + this.id);
    let card = document.createElement("div");
    card.setAttribute("id", this.id);
    card.className = "card " + this.class + " ";
    for (let i = 0; i < this.category.length; i++) {
        card.className += this.category[i] + " ";
    }
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

    let cardInfo = document.createElement("div");
    cardInfo.className = "card-info";
    cardContent.append(cardInfo);

    let cardTitle = document.createElement("h1");
    cardTitle.className = "card-title";
    cardTitle.innerHTML = this.title;
    cardInfo.append(cardTitle);

    let cardSubtitle = document.createElement("p");
    cardSubtitle.className = "card-subtitle";
    cardSubtitle.innerHTML = this.subtitle;
    cardInfo.append(cardSubtitle);
};


window.onload = function () {
    DynamicData.init();
}