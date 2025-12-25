var sound = new Howl({
  urls: ["song/background.mp3"],
  loop: true,
  volume: 0.5,
});

function loading() {
  $("body").css("height", $(window).height());
  setTimeout(function () {
    $(".spinner").hide();
    $("#start-btn").fadeIn();
  }, 1500);
}

function loadingVisible() {
  $("#loading").css("visibility", "hidden");
  $("body").css({
    overflow: "visible",
    height: "100%",
  });
  sound.play();
}

// Hàm kích hoạt toàn bộ trải nghiệm
function startExperience() {
  // 1. QUAN TRỌNG: Đánh thức AudioContext của Howler (dành cho Chrome/Edge/Safari)
  if (Howler.ctx && Howler.ctx.state === "suspended") {
    Howler.ctx.resume().then(function () {
      console.log("AudioContext đã được đánh thức!");
      sound.play();
    });
  } else {
    sound.play();
  }

  // 2. Ẩn màn hình loading
  $("#loading").fadeOut(500);
  $("body").css({
    overflow: "visible",
    height: "100%",
  });
  // 3. THÊM DÒNG NÀY: Hiện thanh nhiệm vụ sau khi vào màn hình chính
  setTimeout(function () {
    $("#mission-bar").fadeIn(800, function () {
      // Sau khi hiện xong (callback), đợi tiếp 15 giây (15000ms) rồi ẩn đi
      setTimeout(function () {
        $("#mission-bar").fadeOut(1000); // Ẩn đi trong vòng 1 giây cho mượt
      }, 15000);
    });
  }, 1000); // Hiện ra sau khi vào màn hình chính 1 giây
}

/* Scroll Title Begin */
var scrl = "Giáng sinh vui vẻ! ";
function scrlsts() {
  scrl = scrl.substring(1, scrl.length) + scrl.substring(0, 1);
  document.title = scrl;
  setTimeout("scrlsts()", 100);
}
/* Scroll Title End */

/* Santa Claus Begin */
// Ông già noel
var leftToRight = true;
var endPos = 0;
var size = 0;
function showSantaClaus() {
  if (leftToRight == true) {
    leftToRight = false;
    endPos = $(window).width();
    $("img#santaClaus").attr("src", "imgs/santaclaus.gif");
    $("img#santaClaus").css("left", "-390px");
  } else {
    leftToRight = true;
    endPos = -390;
    $("img#santaClaus").attr("src", "imgs/santaclausreverse.gif");
    $("img#santaClaus").css("left", $(window).width() + "px");
  }

  size = Math.floor(Math.random() * 5 + 1) + 15;
  $("img#santaClaus").css("height", size + "%");
  $("img#santaClaus").css("width", size + "%");
  $("img#santaClaus").css("top", Math.floor(Math.random() * 10 + 1) + 5 + "%");

  $("img#santaClaus").animate(
    {
      left: endPos,
    },
    15000,
    "linear",
    showSantaClaus
  );
}
/* Santa Claus End */

/* Snow Begin */
// Kích thước màn hình
var SCREEN_WIDTH = $(window).width();
var SCREEN_HEIGHT = $(window).height();

// Vị trí giữa màn hình
var windowHalfX = SCREEN_WIDTH / 2;
var windowHalfY = SCREEN_HEIGHT / 2;

// Tọa độ chuột
var mouseX = 0;
var mouseY = 0;

var container;
var particle;
var camera;
var scene;
var renderer;

// Mảng các bông tuyết
var particles = [];
var particleImage = new Image();
particleImage.src = "imgs/particlesmoke.png";

function snowEffectBind() {
  container = $(".snow");

  camera = new THREE.PerspectiveCamera(
    75,
    SCREEN_WIDTH / SCREEN_HEIGHT,
    1,
    10000
  );
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.add(camera);

  renderer = new THREE.CanvasRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  var material = new THREE.ParticleBasicMaterial({
    map: new THREE.Texture(particleImage),
  });

  for (var i = 0; i < 500; i++) {
    particle = new Particle3D(material);
    particle.position.x = Math.random() * 2000 - 1000;
    particle.position.y = Math.random() * 2000 - 1000;
    particle.position.z = Math.random() * 2000 - 1000;
    particle.scale.x = particle.scale.y = 1;
    scene.add(particle);
    particles.push(particle);
  }

  container.html(renderer.domElement);

  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("touchstart", onDocumentTouchStart, false);
  document.addEventListener("touchmove", onDocumentTouchMove, false);

  setInterval(loop, 1000 / 60);
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

function loop() {
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    particle.updatePhysics();

    with (particle.position) {
      if (y < -1000) y += 2000;
      if (x > 1000) x -= 2000;
      else if (x < -1000) x += 2000;
      if (z > 1000) z -= 2000;
      else if (z < -1000) z += 2000;
    }
  }

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
/* Snow End */

var bShowLetter = false;
$(document).ready(function () {
  $("#start-btn").click(function () {
    startExperience();
  });

  scrlsts();
  snowEffectBind();
  showSantaClaus();

  // Bắt sự kiện nhấn tuần lộc
  $("#reindeer").click(function () {
    // Chưa mở thư
    if (bShowLetter == false) {
      $("#reindeer").animate(
        {
          right: -122,
        },
        1000,
        function () {
          $("#letter").show("drop", { direction: "down" }, "fast");

          $("img#reindeer").attr("src", "imgs/reindeerhide.png");

          $("#reindeer").animate(
            {
              right: 0,
            },
            1000,
            function () {
              $(".message").typed({
                strings: [
                  "<<< Merry Christmas >>>",
                  "Mong món quà nhỏ này của anh sẽ giúp bé Tiên có một cuối ngày giáng sinh dui dẻ nha =)) Nhìn thử cây thông có gì nha (từ trên xuống dưới). Nhấn Đọc xong để tắt cái này đi ~/'-'/~",
                ],
                typeSpeed: 25,
                startDelay: 500,
                backSpeed: 20,
                backDelay: 4000,
                loop: true,
                contentType: "html",
                showCursor: false,
              });
            }
          );
        }
      );

      bShowLetter = true;
    } else {
      $("#reindeer").animate(
        {
          right: -122,
        },
        1000,
        function () {
          $("#letter").hide("drop", { direction: "down" }, "slow");

          $("img#reindeer").attr("src", "imgs/reindeer.png");

          $("#reindeer").animate(
            {
              right: 0,
            },
            1000
          );
        }
      );

      bShowLetter = false;
    }
  });
  // 1. Cấu hình nội dung cho từng hộp quà
  const giftContents = {
    1: {
      type: "video",
      title: "Tiên nữ giáng trần 💖💖💖💖",
      src: "imgs/betien.mp4", // Đường dẫn ảnh của bạn
    },
    2: {
      type: "video",
      title:
        "Kỷ niệm của chúng mình 🎥 (yêu cầu bữa sau quay video đàng hoàng cho tui nghe chưa ông)",
      src: "imgs/vid.mp4", // Đường dẫn video của bạn
    },
    3: {
      type: "image",
      title: "Chu Vận nè🎉",
      src: "imgs/chuvan.png",
    },
    4: {
      type: "image",
      title: "Hết rầu á ngắm anh đi cho đỡ nhớ =)) Ngủ ngon nha 😘",
      src: "imgs/me.jpg",
    },
    5: {
      type: "video",
      title: "Coi như mình đi noel sớm đi 🎄 =))",
      src: "imgs/firstdate.mp4",
    },
    6: {
      type: "video",
      title: "Hihi, anh hớt tay trên lấy video của e luôn kk 🎅",
      src: "imgs/noel.mp4",
    },
  };

  // 2. Xử lý khi click vào hộp quà
  $(".gift-box").on("click", function () {
    const giftId = $(this).data("gift");
    const gift = giftContents[giftId];
    let htmlContent = "";

    if (gift) {
      if (gift.type === "image") {
        htmlContent = `<h3>${gift.title}</h3><img src="${gift.src}">`;
      } else if (gift.type === "video") {
        htmlContent = `<h3>${gift.title}</h3>
                       <video controls autoplay loop>
                         <source src="${gift.src}" type="video/mp4">
                         Trình duyệt của bạn không hỗ trợ video.
                       </video>`;
      }
    } else {
      htmlContent =
        "<h3>Hộp quà bí ẩn</h3><p>Quà đang được chuẩn bị, quay lại sau nhé!</p>";
    }

    $("#modalBody").html(htmlContent);
    $("#giftModal").fadeIn(300);
  });

  // 3. Đóng Modal
  $(".close, #giftModal").click(function (e) {
    // Nếu click vào dấu X hoặc click ra ngoài vùng trắng (vùng tối)
    if (e.target === this || $(e.target).hasClass("close")) {
      $("#giftModal").fadeOut(300, function () {
        $("#modalBody").html(""); // QUAN TRỌNG: Xóa nội dung để dừng video ngay lập tức
      });
    }
  });
});
