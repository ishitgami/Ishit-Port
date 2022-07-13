'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "fc7f0b2e0b5651f979a80b86aed63baa",
"assets/assets/1.png": "38a9b71aad063ab746a7dfaa842750ab",
"assets/assets/11.png": "fc7a2c73d4056e057899236d09791e6a",
"assets/assets/111.png": "17ee50b8cff85fdfd5df1e2fd8a8b417",
"assets/assets/2.png": "b9f76299b4bd7aa2b765ef197c4d6312",
"assets/assets/20483.jpg": "34418553b6a894998d004e862a2ed0c0",
"assets/assets/22.png": "4be740273fda96ac388006fad8126769",
"assets/assets/222.png": "8279e382be87edb6473ff445ba3ae301",
"assets/assets/333.png": "f373fe8f5669fe14201e1efd878c0df5",
"assets/assets/444.png": "e3cf4b4b34b30162e8834148c952c6f7",
"assets/assets/555.png": "41e7c6724df335b352d70b6548b7aeb3",
"assets/assets/img1.png": "284e461e98b3af7748c3bdf101949ef9",
"assets/assets/img2.png": "49d39274d5f279044e6b1fa835d6a55d",
"assets/assets/img3.png": "3fcadc2baa0580ff084b7bf02f94afcf",
"assets/assets/img4.png": "ed6c4d7739c48fe8a1d0088816eb0528",
"assets/assets/img5.png": "b3a4a93003c7432debbac35caab52eec",
"assets/assets/img6.png": "7e6bd4b2483afdeca0363490c242b57d",
"assets/assets/ishit.png": "bc3d01ff3791fa804636cb3c73f52ec5",
"assets/assets/manInSpace.png": "6ef2b2e21f035d57e92847f97487a298",
"assets/assets/parallax0.png": "bac00e42cc8bf06df9d05485095469da",
"assets/assets/parallax1.png": "95044d146ce7064a1e7de6feeb221a47",
"assets/assets/parallax2.png": "10606216739db46c6e924a879962c6e0",
"assets/assets/parallax3.png": "2c1791eb9f8c8abd3b32bd78e25b1735",
"assets/assets/parallax4.png": "85af35fc3d60d06c95e014b2d28e9064",
"assets/assets/parallax5.png": "22944f56a35ee5d3ae67bad3ca8188b9",
"assets/assets/parallax6.png": "62e88f1523433e6858111393766fcbb7",
"assets/assets/parallax7.png": "9aadff21aad1be958be0199d07ea03d9",
"assets/assets/parallax8.png": "a1124ff21bbefb8a1c63fdd525891a80",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "5f81feabaa51698738e3efcd1d17e1e9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "7bf0a3a3fdf6c9585e6f85eb6b5c9158",
"/": "7bf0a3a3fdf6c9585e6f85eb6b5c9158",
"main.dart.js": "7fea1e6bd623b9591dab18d00ac4ea67",
"manifest.json": "466b05f95cab294209e5072e79eb1837",
"version.json": "e3f789945c957aed15f1851761c7e38a"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
