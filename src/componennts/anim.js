export const LeftSectionSlide = {
    initial: {
        x: "-100%",
        opacity: 0
    },
    enter: {
        x: "0%",
        transition: {duration: 0.6},
        opacity: 1,
    },
    exit: {
        x: "-100%",
        transition: {duration: 0.6},
        opacity: 0,
    }
}

export const RightSectionSlide = {
    initial: {
        x: "100%"
    },
    enter: {
        x: "0%",
        transition: {duration: 0.6}
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
        transition: {duration: 0.6},
        opacity: 1
    },
    exit: {
        x: "-100%",
        transition: {duration: 0.6},
        opacity: 0

    }
}