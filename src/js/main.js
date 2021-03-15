var App = {
    showConsole: true,
    transitionSpeed: 0.38,
    dynamicData: null,

    init: function () {
        this.cons("App initialized, console is active");
        this.getDynamicData();
        Home.init();
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
            // populateFeaturedWork(App.dynamicData);
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
        cards: $(".js-fw-card").toArray(),

        init: function () {
            App.cons("FW initialized: " + Home.featuredWork.cards.length + " cards are being displayed:");

            //Add click handler to all cards
            $.each(Home.featuredWork.cards, function (i) {
                App.cons(Home.featuredWork.cards[i].id);
                $(this).on("click", Home.featuredWork.cardHandler);
            });

        },

        populate: function () {

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
    title: $(".project-title"),
    subtitle: $(".project-subtitle"),
    category: $(".project-category"),
    closeBtn: $(".close-btn"),

    init: function (projectID) {
        this.id = projectID;
        this.populate.search();
    },

    populate: {
        search: function () {
            let dynamicData = App.dynamicData['projects'];
            App.cons("Searching for '" + Project.id + "' inside dynamic data");
            var results = [];
            var searchField = "id";
            var searchVal = Project.id;

            for (var i = 0; i < dynamicData.length; i++) {
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