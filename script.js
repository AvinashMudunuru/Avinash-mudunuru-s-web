// this part makes the little dots and lines move around in the background
// got the basic idea from a youtube tutorial and changed it up a bit
(function () {
  var canvas = document.getElementById('bgCanvas');
  var ctx = canvas.getContext('2d');
  var w, h, dpr;
  var dots = [];
  var mouseX = null, mouseY = null, mouseIsOn = false;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dotColor = '0, 210, 255';
  var lineDist = 130;
  var mouseDist = 160;
  var speed = 0.18;
  var density = 16000;

  function resizeStuff() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeDots();
  }

  function makeDots() {
    var howMany = Math.round((w * h) / density);
    dots = [];
    for (var i = 0; i < howMany; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.4 + 0.6
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x = d.x + d.vx;
      d.y = d.y + d.vy;

      if (d.x < 0 || d.x > w) d.vx = d.vx * -1;
      if (d.y < 0 || d.y > h) d.vy = d.vy * -1;

      if (mouseIsOn) {
        var dx = d.x - mouseX;
        var dy = d.y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDist) {
          var push = (mouseDist - dist) / mouseDist;
          d.x = d.x + (dx / dist) * push * 1.1;
          d.y = d.y + (dy / dist) * push * 1.1;
        }
      }

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + dotColor + ', 0.85)';
      ctx.fill();
    }

    // draw connecting lines between dots that are close to each other
    for (var i = 0; i < dots.length; i++) {
      for (var j = i + 1; j < dots.length; j++) {
        var a = dots[i], b = dots[j];
        var dx2 = a.x - b.x, dy2 = a.y - b.y;
        var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < lineDist) {
          var op = (1 - dist2 / lineDist) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(' + dotColor + ', ' + op + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) {
      requestAnimationFrame(drawFrame);
    }
  }

  window.addEventListener('resize', resizeStuff);
  window.addEventListener('pointermove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseIsOn = true;
  });
  window.addEventListener('pointerleave', function () {
    mouseIsOn = false;
  });

  resizeStuff();
  if (reduceMotion) {
    drawFrame();
  } else {
    requestAnimationFrame(drawFrame);
  }
})();

// this tries to load my profile photo, checking a few common file names/extensions
// so i dont have to worry about exact spelling when i upload the photo
(function () {
  var img = document.getElementById('profilePic');
  var fallback = img.nextElementSibling;
  var namesToTry = [
    'profile.jpg',
    'profile.jpeg',
    'profile.png',
    'profile.JPG',
    'profile.PNG',
    'photo.jpg',
    'photo.png',
    'avinash.jpg',
    'avinash.png'
  ];
  var tryIndex = 0;

  function tryNext() {
    if (tryIndex >= namesToTry.length) {
      // none of them worked, so just show the AV letters instead
      img.style.display = 'none';
      fallback.style.display = 'flex';
      return;
    }
    img.src = namesToTry[tryIndex];
    tryIndex = tryIndex + 1;
  }

  img.addEventListener('error', tryNext);
  tryNext();
})();

// live clock for the header, shows IST time
function updateClock() {
  var el = document.getElementById('clockOutput');
  var now = new Date();
  var ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  var hh = String(ist.getHours()).padStart(2, '0');
  var mm = String(ist.getMinutes()).padStart(2, '0');
  var ss = String(ist.getSeconds()).padStart(2, '0');
  el.textContent = hh + ':' + mm + ':' + ss + ' IST';
}
updateClock();
setInterval(updateClock, 1000);

// footer year, so i dont have to update it by hand every year
document.getElementById('yearNow').textContent = new Date().getFullYear();

// makes the cards/buttons fade in when you scroll down to them
(function () {
  var stuffToWatch = document.querySelectorAll('.secHead, .card, .connectBtn');
  var watcher = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        watcher.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  for (var i = 0; i < stuffToWatch.length; i++) {
    watcher.observe(stuffToWatch[i]);
  }
})();
