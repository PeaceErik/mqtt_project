// Darkmode og Lightmode - Som objekter

/* const darkMode = {
    background: '#3e3e3e', 
    text: '#16a085', 
    lightTxt: '#e5e5e5'
}

const lightMode = {
    background: '#e5e5e5', 
    text: '#3e3e3e', 
} */

let getGsapVenner = document.body.querySelector(".gsap-venner")
let go = document.body.querySelector('.go')
let verified = document.body.querySelector('.verified')
let columns = document.body.querySelectorAll('.column')
let smColumns = document.body.querySelectorAll('.column-sm')
let arrows = document.body.querySelectorAll('.arrow')

// THEME ANIMATIONS 

/* let darkModeBG = gsap.fromTo(
    document.body, 
    {
        background: lightMode.background, 
    }, 
    {
        background: darkMode.background, 
        duration: 0.4, 
        ease: 'linear', 
        paused: true
    }
)

let darkModeWelcome = gsap.fromTo(
    '.welcome-txt', 
    {
        color: lightMode.text, 
    }, 
    {
        color: darkMode.text, 
        duration: 0.4, 
        ease: 'linear', 
        paused: true
    }
) */

// START ANIMATIONER NÅR DOM CONTENT HAR LOADED

let onColumnAnimation = gsap.fromTo(
    columns, 
    {
        scaleY: 0,  
    }, 
    {
        scaleY: 1, 
        duration: 2.0, 
        ease: 'linear', 
        stagger: 0.2, 
        paused: true
    }
)

let onSmallColumnAnimation = gsap.fromTo(
    smColumns, 
    {
        scaleY: 0, 
    }, 
    {
        scaleY: 1, 
        duration: 1.0, 
        ease: 'linear', 
        stagger: 0.2, 
        delay: 2.0,
        paused: true
    }
)

let secWare = gsap.fromTo(
    ".secure-stagger",
    {
        opacity: 0.0,
    },
    {
        opacity: 1.0,
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.5,
        paused: true

    }
)

let welcomeTxt = gsap.fromTo(
    ".welcome-txt",
    {
        opacity: 0.0,
    },
    {
        opacity: 1.0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.inOut",
        paused: true
    }

)

let infoTxt = gsap.fromTo(
    ".info-txt",
    {
        opacity: 0.0,
    },
    {
        opacity: 0.9,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.inOut",
        paused: true
    }
)

let arrowFade = gsap.fromTo(
    arrows,
    {
        opacity: 0.0
    }, 
    {
        opacity: 1.0, 
        duration: 0.5, 
        delay: 0.4,
        stagger: 0.2, 
        ease: 'power2.inOut', 
        paused: true
    }
)

document.addEventListener('DOMContentLoaded', (e) => 
{ 
    console.log(e)
    onColumnAnimation.play() 
    onSmallColumnAnimation.play()
        .eventCallback('onComplete', () => 
        {
            secWare.play() 
                .eventCallback('onComplete', () =>
                {
                    welcomeTxt.play()
                    .eventCallback('onComplete', () =>
                    {
                        infoTxt.play()
                        arrowFade.play()
                    })
                    
                }
            )
            
        })
})

// ANIMATIONER NÅR DER SCANNES KORT

let onOpacityChange = gsap.fromTo(
    // Array med klasser der skal fades ud
    [
        '.to', 
        '.company-name',
    ], 
    // fra værdi(er)
    {
        opacity: 1.0, 
    },
    // til værdi(er)
    {
        opacity: 0.0,
        duration: 0.8, 
        ease: 'power2.inOut', 
        paused: true
    }
)

let onVennerIn = gsap.fromTo (
    getGsapVenner,
    //fra værdi(er)
    {
        opacity: 0.0,
    },
    // til værdi(er)
    {
        opacity: 1.0,
        duration: 0.7,
        delay: 0.4,
        ease: 'power2.inOut',
        paused: true
    }
)

let onVerified = gsap.fromTo (
    verified,
    {
        opacity: 0.0,
    },
    {
        opacity: 0.8,
        duration: 0.7,
        delay: 0.3,
        ease: 'power2.inOut',
        paused: true
    }
)

let onBorderShow = gsap.fromTo(
    '.border', 
    {
        height: '0px'
    }, 
    {
        height: '50px', 
        duration: 0.7, 
        ease: 'power2.inOut', 
        paused: true
    }
)

let goRightThrough = gsap.fromTo (
    go,
    {
        opacity: 0.0,
    },
    {
        opacity: 0.9,
        duration: 1.5,
        delay: 0.5,
        ease: 'power2.inOut',
        repeat: 5,
        paused: true
    }
)

const socket = io(); 

socket.on('Verified', (data) => 
{   // Her henter jeg dataen ind fra kortscan = Name
    // Derudover Chainer jeg de forskellige Gsap animationer
    // så de bliver smidt ind på siden en efter en, og ikke på en gang
    // Til sidst reverse vi det hele for at en ny medarbejder kan logge ind
    getGsapVenner.innerHTML=data
    infoTxt.reverse()
    arrowFade.reverse()
    onOpacityChange.play()
        .eventCallback("onComplete", () =>
        {
           onVerified.play()
            .eventCallback("onComplete", () =>
            {
                onBorderShow.play()
                    .eventCallback('onComplete', () => 
                    {
                        onVennerIn.play()
                            .eventCallback('onComplete', () =>
                            {
                                goRightThrough.play().repeat(5)
                                    .eventCallback('onComplete', () => 
                                    {
                                        goRightThrough.reverse().repeat(0)
                                        onVennerIn.reverse()
                                        onBorderShow.reverse()
                                        onVerified.reverse()
                                            .eventCallback('onReverseComplete', () => 
                                            {
                                                onOpacityChange.reverse()
                                                infoTxt.play()
                                                arrowFade.play()
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }
                )
            }) 
        }
    ) 
})

socket.on('Notverified', () => 
{

    verified.innerHTML = 'Card declined.'
    go.innerHTML = 'Please try again!'

    
    onOpacityChange.play()
        .eventCallback('onComplete', () => 
        {
            onVerified.play()
            .eventCallback('onComplete', () =>
            {
                goRightThrough.play()
            } )
        }
    )
})