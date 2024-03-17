export const LeftSectionSlide = {
    initial: {
        x: "-100%",
        opacity: 0
    },
    enter: {
        x: "0%",
        transition: {duration: 0.4},
        opacity: 1,
    },
    exit: {
        x: "-100%",
        transition: {duration: 0.4},
        opacity: 0,
    }
}

export const RightSectionSlide = {
    initial: {
        x: "100%"
    },
    enter: {
        x: "0%",
        transition: {duration: 0.4}
    },
    exit: {
        x: "100%"
    }
}

export const LeftSectionSlideHide = {
    initial: {
        x: "-100%",
        opacity: 0
    },
    enter: {
        x: "0%",
        transition: {duration: 0.4},
        opacity: 1
    },
    exit: {
        x: "-100%",
        transition: {duration: 0.4},
        opacity: 0

    }
}

export const MatchSectionSlide = {
    initial: {
        y: "-10vh",
        opacity: 0
    },
    enter: {
        y: "0vh",
        transition: {duration: 0.2},
        opacity: 1
    },
}


export const PreferencesSectionSlide = {
    initial: {
        y: "-3vh",
        opacity: 0,
    },
    enter: {
        y: "0vh",
        transition: {duration: 0.2},
        opacity: 1,
    },
}

export const icon = {
    hidden: {
      pathLength: 0,
      fill: "rgba(255, 255, 255, 0)"
    },
    visible: {
      pathLength: 1,
      fill: "rgba(255, 255, 255, 1)"
    },
}