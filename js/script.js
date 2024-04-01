//seleccionando elementos del DOM
const $carrusel = document.querySelector(".carrusel"),
  $carrusel_img = document.querySelector(".carrusel_img_container"),
  $next = document.querySelector(".next"),
  $after = document.querySelector(".after"),
  $root = document.documentElement.style,
  $carrusel_img_ancho = $carrusel_img.clientWidth,
  $nav = document.querySelector(".nav_ul_container"),
  $video = document.querySelector(".hero_video video");

// variables globales
$entrys = document.querySelectorAll("section[data-spy]");
$video.setAttribute("autoplay", "true");
$img = document.querySelectorAll(".carrusel_img");

//variables locales
let $btn_menu = document.querySelector(".img_menu");
let count = 0;
let $carrusel_ancho = $carrusel.clientWidth;
let $documento = document.querySelector("body").clientWidth;
let bool = false;

//funcion que obtiene el transform
const transform = () => {
  //obtenemos el transform que ya se le aplico al objeto y lo guardo en una variable para retornar
  let sizing = parseInt(
    $root.getPropertyValue("--transform").replace("px", "")
  );
  return sizing;
};

// soporte para animaciones porque no funcionan en android
if (
  navigator.userAgent.includes("Android") ||
  navigator.userAgent.includes("iPhone")
) {
  const elements = document.querySelectorAll("section[data-spy] article");
  elements.forEach((el) => {
    el.style.setProperty("opacity", "1");
  });
}

$root.setProperty("--transform", "0");
//funcioon de movimiento
const movimiento = (mov) => {
  if (mov == "izquierda") {
    //modificamos la variable antes declarada en css, restandole el valor que tenia menos el ancho de la ventana
    $root.setProperty("--transform", `-${$carrusel_ancho - transform()}px`);
    transform();
    count++;

    if (count == $img.length) {
      $root.setProperty("--transform", `0px`);
      count = 0;
    }
  } else if (mov == "derecha") {
    $root.setProperty("--transform", `${$carrusel_ancho + transform()}px`);
    transform();
    count--;
    if (count < 0) {
      $root.setProperty("--transform", `0px`);
      count = 0;
    }
  }
};

//botones de siguiente y atras del carrusel
document.addEventListener("click", (e) => {
  if (e.target.matches(".next")) {
    movimiento("derecha");
  }

  if (e.target.matches(".after")) {
    movimiento("izquierda");
  }
});

//carrusel automatico
setInterval(() => {
  movimiento("izquierda");
}, 6000);

// redimencionado de la pantalla
//adaptandolo para que el carrusel no se rompa al redimencionar la pantalla
window.addEventListener("resize", (e) => {
  $root.setProperty("--transform", `0px`);
  let cont = document.querySelector(".carrusel").clientWidth;
  $carrusel_ancho = cont;
  $documento = document.querySelector("body").clientWidth;
  if ($documento > 1134) {
    $nav.style.setProperty("transform", "translateX(0)");
  } else {
    cerrar();
  }
  count = 0;
});

// interseccion observer

//funcion que se encarga de ejecutar algo cuando el objeto observado entra en la pantalla
const intersecciones = (entries) => {
  entries.forEach((el) => {
    const id = el.target.id;
    //obtengo la clase del contenedor
    const clas = el.target.classList[0];
    //obtengo el elemento a animar a partir de la clase padre
    const elements = document.querySelector(`.${clas} article`).classList[0];
    if (el.isIntersecting) {
      document.querySelector(`a[href="#${id}"]`).classList.add("claridad");
      gsap.to(`.${elements}`, {
        duration: 0.4,
        opacity: "1",
        y: 0,
        delay: 0.4,
      });
    } else {
      document.querySelector(`a[href="#${id}"]`).classList.remove("claridad");
    }
  });
};

//objeto para intersectar el objeto que esta en la pantalla, recibe dos
//parametros; la funcion que le manda el objeto desde el HTML y un segundo objeto
//que contiene comportamientos para la interseccion
const observer = new IntersectionObserver(intersecciones, {
  rootMargin: "-570px",
});

//hay que colocar ese atributo al contenedor de cada uno de los elementos a observar
$entrys.forEach((el) => {
  observer.observe(el);
});

// nav movil dinamic

document.addEventListener("click", (e) => {
  if (e.target.matches(".img_menu")) {
    console.log($btn_menu);
    //sele pregubta al menu si esta abierto
    //en caso de estarlo se cierra
    if (bool == true) {
      cerrar();
      bool == false;
    } else {
      //en caso de estar cerrado se abre
      bool = true;
      $btn_menu.setAttribute("src", "source/close.png");

      gsap.to(".img_menu", {
        duration: 0.4,
        rotation: 540,
      });
      gsap.to(".nav_ul_container", {
        duration: 0.2,
        x: 0,
      });
    }
  }

  if (
    !e.target.matches(".img_menu") &&
    !e.target.matches(".nav_ul_container") &&
    !e.target.matches(".links_container") &&
    $documento < 1134 &&
    bool == true
  ) {
    cerrar();
  }
});

function cerrar() {
  let timeline1 = gsap.timeline({
    repeat: 0,
  });
  $btn_menu.setAttribute("src", "source/menu abierto.png");
  timeline1.to(".img_menu", {
    duration: 0.4,
    transform: "scale(-1,1)",
    rotation: 0,
  });

  gsap.to(".nav_ul_container", {
    duration: 0.1,
    x: $documento,
  });
  bool = false;
}

// ------------gsap prueba------

gsap.to(".nav_ul_container", {
  duration: 0.4,
  delay: 0.3,
  y: 0,
});
