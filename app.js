/**
 * Lumina Photo Gallery Publishing Site Application Logic
 */

const MAX_COMMENT_LENGTH = 500;

// Initial Sample Photos Data
const DEFAULT_PHOTOS = [
  {
    id: "photo-1",
    title: "Alpine Mist & Peaks",
    author: "Elena Rostova",
    category: "Nature",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    description: "Serene morning light reflecting off alpine waters surrounded by majestic mountain ridges.",
    tags: ["mountains", "reflection", "nature", "serene"],
    city: "Banff",
    likes: 142,
    likedByMe: false,
    views: 1240,
    ratingSum: 24,
    ratingCount: 5,
    myRating: 5,
    createdAt: "2026-08-20T10:30:00.000Z",
    comments: [
      { id: "c1", author: "Liam Vance", text: "The lighting in this shot is absolutely breathtaking!", createdAt: "2026-08-21T14:15:00.000Z" },
      { id: "c2", author: "Aria Chen", text: "Adding this to my desktop wallpaper collection.", createdAt: "2026-08-22T09:00:00.000Z" }
    ]
  },
  {
    id: "photo-2",
    title: "Futuristic Glass Tower",
    author: "Marcus Thorne",
    category: "Architecture",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    description: "Geometric symmetry and clean lines of modern urban architecture against twilight skies.",
    tags: ["architecture", "urban", "glass", "modern"],
    city: "Chicago",
    likes: 98,
    likedByMe: false,
    views: 850,
    ratingSum: 18,
    ratingCount: 4,
    myRating: 0,
    createdAt: "2026-08-22T16:45:00.000Z",
    comments: [
      { id: "c3", author: "David Miller", text: "Incredible perspective and composition!", createdAt: "2026-08-23T11:20:00.000Z" }
    ]
  },
  {
    id: "photo-3",
    title: "Golden Hour Glow",
    author: "Sophia Martinez",
    category: "Portraits",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    description: "Natural portrait photography captured during warm sunset golden hour.",
    tags: ["portrait", "goldenhour", "bokeh", "sunset"],
    city: "Barcelona",
    likes: 215,
    likedByMe: false,
    views: 2310,
    ratingSum: 25,
    ratingCount: 5,
    myRating: 5,
    createdAt: "2026-08-23T18:10:00.000Z",
    comments: [
      { id: "c4", author: "Chloe Bennet", text: "Stunning color palette and warm tones.", createdAt: "2026-08-24T08:05:00.000Z" }
    ]
  },
  {
    id: "photo-4",
    title: "Kyoto Lantern Alleyway",
    author: "Kenji Takahashi",
    category: "Travel",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    description: "Atmospheric evening stroll through historical alleyways lit by traditional paper lanterns.",
    tags: ["japan", "travel", "night", "lanterns"],
    city: "Kyoto",
    likes: 184,
    likedByMe: false,
    views: 1750,
    ratingSum: 19,
    ratingCount: 4,
    myRating: 0,
    createdAt: "2026-08-24T12:00:00.000Z",
    comments: [
      { id: "c5", author: "Oliver Scott", text: "I can almost hear the peaceful evening sounds.", createdAt: "2026-08-25T13:40:00.000Z" }
    ]
  },
  {
    id: "photo-5",
    title: "Prism Waves & Light",
    author: "Maya Lin",
    category: "Abstract",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
    description: "Vibrant abstract fluid dynamics exploring color refractions and wave motion.",
    tags: ["abstract", "color", "waves", "fluid"],
    city: "Reykjavik",
    likes: 76,
    likedByMe: false,
    views: 420,
    ratingSum: 16,
    ratingCount: 4,
    myRating: 0,
    createdAt: "2026-08-25T09:15:00.000Z",
    comments: []
  },
  {
    id: "photo-6",
    title: "Coastal Emerald Cove",
    author: "Elena Rostova",
    category: "Nature",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    description: "Crystal clear turquoise tide gently washing over white sand beaches.",
    tags: ["ocean", "beach", "coastal", "summer"],
    city: "Maui",
    likes: 162,
    likedByMe: false,
    views: 1530,
    ratingSum: 23,
    ratingCount: 5,
    myRating: 0,
    createdAt: "2026-08-25T15:30:00.000Z",
    comments: [
      { id: "c6", author: "Lucas Wright", text: "Dream destination! Amazing contrast.", createdAt: "2026-08-26T07:12:00.000Z" }
    ]
  },
  {
    id: "photo-7",
    title: "Secret Celestial Aurora",
    author: "Elena Rostova",
    category: "Nature",
    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80",
    description: "Vibrant emerald northern lights dancing across icy fjords under starlight.",
    tags: ["aurora", "night", "stars", "private"],
    city: "Tromso",
    likes: 289,
    likedByMe: false,
    views: 3100,
    ratingSum: 25,
    ratingCount: 5,
    myRating: 5,
    isPrivate: true,
    password: "1234",
    createdAt: "2026-08-26T09:00:00.000Z",
    comments: [
      { id: "c7", author: "Sarah Connor", text: "Password protected perfection!", createdAt: "2026-08-26T09:45:00.000Z" }
    ]
  },
  {
    id: "photo-8",
    title: "Midnight Roadster",
    author: "Jordan Blake",
    category: "Cars",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    description: "A classic roadster framed against a quiet mountain highway at first light.",
    tags: ["car", "roadster", "automotive", "highway"],
    city: "Big Sur",
    likes: 127,
    likedByMe: false,
    views: 965,
    ratingSum: 22,
    ratingCount: 5,
    myRating: 0,
    createdAt: "2026-08-27T08:30:00.000Z",
    comments: [
      { id: "c8", author: "Avery Brooks", text: "The lines and early light work beautifully together.", createdAt: "2026-08-28T10:20:00.000Z" }
    ]
  }
];

// App State Management
class GalleryApp {
  constructor() {
    this.photos = this.loadPhotos();
    this.collections = this.loadCollections();
    this.recentlyViewed = this.loadRecentlyViewed();
    this.currentCategory = "all";
    this.currentCity = "all";
    this.currentTag = null;
    this.currentCollectionId = "all";
    this.searchQuery = "";
    this.currentSort = "newest";
    this.selectedPhotoId = null;
    this.pendingUnlockPhotoId = null;
    this.pendingUnlockAction = null;
    this.previewImageDataUrl = null;
    this.selectedUploadFile = null;
    this.lastFocusedElement = null;

    this.initDOMElements();
    this.applyTheme(this.loadTheme());
    this.bindEvents();
    this.renderGallery();
  }

  loadTheme() {
    try {
      return localStorage.getItem("lumina_theme") === "light" ? "light" : "dark";
    } catch (error) {
      console.warn("Unable to read theme preference:", error);
      return "dark";
    }
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    const isLight = theme === "light";
    this.themeToggleBtn.setAttribute("aria-pressed", String(isLight));
    this.themeToggleBtn.querySelector("span").textContent = isLight ? "Dark mode" : "Light mode";
    this.themeToggleBtn.querySelector("i").className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    this.themeToggleBtn.title = isLight ? "Switch to dark mode" : "Switch to light mode";
  }

  toggleTheme() {
    this.applyTheme(this.currentTheme === "dark" ? "light" : "dark");
    try {
      localStorage.setItem("lumina_theme", this.currentTheme);
    } catch (error) {
      console.error("Unable to save theme preference:", error);
      alert("Your theme changed, but the preference could not be saved.");
    }
  }

  loadPhotos() {
    const stored = localStorage.getItem("lumina_photos");
    if (stored) {
      let photos;
      try {
        photos = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored photos:", e);
      }

      if (Array.isArray(photos)) {
        const normalizedPhotos = photos.map(photo => this.normalizePhoto(photo)).filter(Boolean);
        if (JSON.stringify(photos) !== JSON.stringify(normalizedPhotos)) {
          try {
            localStorage.setItem("lumina_photos", JSON.stringify(normalizedPhotos));
          } catch (e) {
            console.warn("Storage write failed while normalizing photos:", e);
          }
        }
        return normalizedPhotos;
      }
    }
    try {
      localStorage.setItem("lumina_photos", JSON.stringify(DEFAULT_PHOTOS));
    } catch (e) {
      console.warn("Storage write failed on initial load:", e);
    }
    return DEFAULT_PHOTOS;
  }

  savePhotos() {
    try {
      localStorage.setItem("lumina_photos", JSON.stringify(this.photos));
    } catch (e) {
      console.error("Failed to save photos to localStorage:", e);
      if (e.name === "QuotaExceededError" || e.code === 22) {
        alert("Storage limit reached! Please delete or compress large images to save state.");
      }
    }
  }

  loadCollections() {
    const stored = localStorage.getItem("lumina_collections");
    if (!stored) return [];

    let collections;
    try {
      collections = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored collections:", e);
    }

    if (Array.isArray(collections)) {
      const photoIds = new Set(this.photos.map(photo => photo.id));
      const normalizedCollections = collections
        .filter(collection => collection && typeof collection === "object")
        .map(collection => {
          const collectionPhotoIds = [...new Set(Array.isArray(collection.photoIds) ? collection.photoIds.map(String) : [])]
            .filter(photoId => photoIds.has(photoId));
          const requestedCoverPhotoId = collection.coverPhotoId ? String(collection.coverPhotoId) : null;
          return {
            id: String(collection.id || `collection-${Date.now()}`),
            name: String(collection.name || "").trim(),
            description: String(collection.description || "").trim(),
            coverPhotoId: requestedCoverPhotoId && collectionPhotoIds.includes(requestedCoverPhotoId)
              ? requestedCoverPhotoId
              : collectionPhotoIds[0] || null,
            photoIds: collectionPhotoIds,
            createdAt: collection.createdAt || new Date().toISOString()
          };
        })
        .filter(collection => collection.name);

      if (JSON.stringify(collections) !== JSON.stringify(normalizedCollections)) {
        try {
          localStorage.setItem("lumina_collections", JSON.stringify(normalizedCollections));
        } catch (e) {
          console.warn("Storage write failed while normalizing collections:", e);
        }
      }
      return normalizedCollections;
    }
    return [];
  }

  saveCollections() {
    try {
      localStorage.setItem("lumina_collections", JSON.stringify(this.collections));
    } catch (e) {
      console.error("Failed to save collections to localStorage:", e);
      alert("Storage limit reached. Unable to save collections.");
    }
  }

  loadRecentlyViewed() {
    const stored = localStorage.getItem("lumina_recently_viewed");
    if (!stored) return [];

    try {
      const history = JSON.parse(stored);
      if (Array.isArray(history)) {
        const photoIds = new Set(this.photos.map(photo => photo.id));
        const seenPhotoIds = new Set();
        const normalizedHistory = history
          .filter(entry => {
            const isValid = entry && typeof entry.photoId === "string" && typeof entry.viewedAt === "string" && entry.viewedAt.trim() && !Number.isNaN(Date.parse(entry.viewedAt)) && photoIds.has(entry.photoId);
            return isValid;
          })
          .sort((firstEntry, secondEntry) => Date.parse(secondEntry.viewedAt) - Date.parse(firstEntry.viewedAt) || firstEntry.photoId.localeCompare(secondEntry.photoId))
          .filter(entry => {
            if (seenPhotoIds.has(entry.photoId)) return false;
            seenPhotoIds.add(entry.photoId);
            return true;
          })
          .slice(0, 20)
          .map(entry => ({ photoId: entry.photoId, viewedAt: entry.viewedAt }));

        if (JSON.stringify(history) !== JSON.stringify(normalizedHistory)) {
          localStorage.setItem("lumina_recently_viewed", JSON.stringify(normalizedHistory));
        }
        return normalizedHistory;
      }
      localStorage.setItem("lumina_recently_viewed", "[]");
    } catch (e) {
      console.error("Failed to parse recently viewed photos:", e);
      localStorage.setItem("lumina_recently_viewed", "[]");
    }
    return [];
  }

  saveRecentlyViewed() {
    try {
      localStorage.setItem("lumina_recently_viewed", JSON.stringify(this.recentlyViewed));
    } catch (e) {
      console.error("Failed to save recently viewed photos:", e);
    }
  }

  recordRecentlyViewed(photoId) {
    this.recentlyViewed = [
      { photoId, viewedAt: new Date().toISOString() },
      ...this.recentlyViewed.filter(entry => entry.photoId !== photoId)
    ].slice(0, 20);
    this.saveRecentlyViewed();
  }

  initDOMElements() {
    this.themeToggleBtn = document.getElementById("themeToggleBtn");
    // Nav & Controls
    this.galleryGrid = document.getElementById("galleryGrid");
    this.noResults = document.getElementById("noResults");
    this.searchInput = document.getElementById("searchInput");
    this.categoryContainer = document.getElementById("categoryContainer");
    this.cityFilterContainer = document.getElementById("cityFilterContainer");
    this.tagFilterContainer = document.getElementById("tagFilterContainer");
    this.collectionFilterContainer = document.getElementById("collectionFilterContainer");
    this.sortSelect = document.getElementById("sortSelect");
    this.recentlyViewedOrderMessage = document.getElementById("recentlyViewedOrderMessage");

    this.openCollectionsBtn = document.getElementById("openCollectionsBtn");
    this.collectionsModal = document.getElementById("collectionsModal");
    this.closeCollectionsModal = document.getElementById("closeCollectionsModal");
    this.collectionForm = document.getElementById("collectionForm");
    this.collectionNameInput = document.getElementById("collectionNameInput");
    this.collectionDescriptionInput = document.getElementById("collectionDescriptionInput");
    this.collectionStatus = document.getElementById("collectionStatus");
    this.collectionsList = document.getElementById("collectionsList");

    // Share Modal Elements
    this.openShareBtn = document.getElementById("openShareBtn");
    this.shareModal = document.getElementById("shareModal");
    this.closeShareModal = document.getElementById("closeShareModal");
    this.shareUrlInput = document.getElementById("shareUrlInput");
    this.copyShareUrlBtn = document.getElementById("copyShareUrlBtn");
    this.copySuccessMsg = document.getElementById("copySuccessMsg");

    // Upload Modal
    this.openUploadBtn = document.getElementById("openUploadBtn");
    this.uploadModal = document.getElementById("uploadModal");
    this.closeUploadModal = document.getElementById("closeUploadModal");
    this.cancelUploadBtn = document.getElementById("cancelUploadBtn");
    this.uploadForm = document.getElementById("uploadForm");
    this.dropZone = document.getElementById("dropZone");
    this.photoFileInput = document.getElementById("photoFileInput");
    this.dropZoneContent = document.getElementById("dropZoneContent");
    this.imagePreviewContainer = document.getElementById("imagePreviewContainer");
    this.imagePreview = document.getElementById("imagePreview");
    this.uploadErrorMsg = document.getElementById("uploadErrorMsg");
    this.removePreviewBtn = document.getElementById("removePreviewBtn");
    this.photoIsPrivate = document.getElementById("photoIsPrivate");
    this.passwordInputGroup = document.getElementById("passwordInputGroup");
    this.photoPassword = document.getElementById("photoPassword");

    // Unlock Modal
    this.unlockModal = document.getElementById("unlockModal");
    this.closeUnlockModal = document.getElementById("closeUnlockModal");
    this.cancelUnlockBtn = document.getElementById("cancelUnlockBtn");
    this.unlockForm = document.getElementById("unlockForm");
    this.unlockPasswordInput = document.getElementById("unlockPasswordInput");
    this.unlockErrorMsg = document.getElementById("unlockErrorMsg");

    // Detail Modal
    this.detailModal = document.getElementById("detailModal");
    this.closeDetailModal = document.getElementById("closeDetailModal");
    this.detailImg = document.getElementById("detailImg");
    this.detailTitle = document.getElementById("detailTitle");
    this.detailAuthor = document.getElementById("detailAuthor");
    this.detailAvatar = document.getElementById("detailAvatar");
    this.detailDate = document.getElementById("detailDate");
    this.detailDescription = document.getElementById("detailDescription");
    this.detailTags = document.getElementById("detailTags");
    this.detailTagForm = document.getElementById("detailTagForm");
    this.detailTagInput = document.getElementById("detailTagInput");
    this.detailTagStatus = document.getElementById("detailTagStatus");
    this.detailLikeBtn = document.getElementById("detailLikeBtn");
    this.detailLikeIcon = document.getElementById("detailLikeIcon");
    this.detailLikeCount = document.getElementById("detailLikeCount");
    this.detailDownloadBtn = document.getElementById("detailDownloadBtn");
    this.detailBookmarkBtn = document.getElementById("detailBookmarkBtn");
    this.detailBookmarkIcon = document.getElementById("detailBookmarkIcon");
    this.detailDeleteBtn = document.getElementById("detailDeleteBtn");
    this.detailViewsCount = document.getElementById("detailViewsCount");
    this.detailAvgRating = document.getElementById("detailAvgRating");
    this.detailRatingCount = document.getElementById("detailRatingCount");
    this.starPicker = document.getElementById("starPicker");
    this.detailCommentCount = document.getElementById("detailCommentCount");
    this.commentsList = document.getElementById("commentsList");
    this.commentForm = document.getElementById("commentForm");
    this.commentAuthorInput = document.getElementById("commentAuthorInput");
    this.commentTextInput = document.getElementById("commentTextInput");
    this.photoCollectionMemberships = document.getElementById("photoCollectionMemberships");
    this.photoCollectionsEmpty = document.getElementById("photoCollectionsEmpty");
  }

  bindEvents() {
    this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    // Search & Filter (Debounced to optimize rendering performance)
    const debouncedSearch = this.debounce((query) => {
      this.searchQuery = query;
      this.renderGallery();
    }, 180);

    this.searchInput.addEventListener("input", (e) => {
      debouncedSearch(e.target.value.toLowerCase().trim());
    });

    this.categoryContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".category-chip");
      if (chip) {
        this.categoryContainer.querySelectorAll(".category-chip").forEach(c => {
          c.classList.remove("active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");
        this.currentCategory = chip.dataset.category;
        this.renderGallery();
      }
    });

    this.cityFilterContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".city-chip");
      if (chip) {
        this.cityFilterContainer.querySelectorAll(".city-chip").forEach(c => {
          c.classList.remove("active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");
        this.currentCity = chip.dataset.city;
        this.renderGallery();
      }
    });

    this.sortSelect.addEventListener("change", (e) => {
      this.currentSort = e.target.value;
      this.renderGallery();
    });

    this.tagFilterContainer.addEventListener("click", (e) => {
      if (e.target.closest(".clear-tag-filter-btn")) {
        this.currentTag = null;
        this.renderGallery();
      }
    });

    this.collectionFilterContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".collection-chip");
      if (!chip) return;
      this.collectionFilterContainer.querySelectorAll(".collection-chip").forEach(c => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      this.currentCollectionId = chip.dataset.collectionId;
      this.renderGallery();
    });

    this.openCollectionsBtn.addEventListener("click", () => {
      this.collectionStatus.textContent = "";
      this.renderCollectionsList();
      this.showModal(this.collectionsModal);
    });
    this.closeCollectionsModal.addEventListener("click", () => this.hideModal(this.collectionsModal));
    this.collectionForm.addEventListener("submit", (e) => this.createCollection(e));
    this.collectionsList.addEventListener("click", (e) => this.handleCollectionManagement(e));
    this.photoCollectionMemberships.addEventListener("change", (e) => {
      const checkbox = e.target.closest(".photo-collection-checkbox");
      if (checkbox) this.togglePhotoCollection(this.selectedPhotoId, checkbox.dataset.collectionId, checkbox.checked);
    });
    this.detailTagForm.addEventListener("submit", (e) => this.addPhotoTags(e));
    this.detailTags.addEventListener("click", (e) => {
      const removeButton = e.target.closest(".remove-tag-btn");
      if (removeButton) this.removePhotoTag(this.selectedPhotoId, removeButton.dataset.tag);
    });

    this.galleryGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".photo-card");
      if (!card) return;

      const photoId = card.dataset.id;
      const tagButton = e.target.closest(".card-tag-btn");
      if (tagButton) {
        this.currentTag = tagButton.dataset.tag;
        this.renderGallery();
        return;
      }

      if (e.target.closest(".quick-like-btn")) {
        this.toggleLike(photoId);
        return;
      }
      if (e.target.closest(".quick-download-btn")) {
        this.downloadPhoto(photoId);
        return;
      }

      if (e.target.closest(".card-detail-btn")) this.openDetailModal(photoId);
    });

    // Share Modal Handlers
    if (this.openShareBtn) {
      this.openShareBtn.addEventListener("click", () => {
        if (this.shareUrlInput) {
          this.shareUrlInput.value = window.location.href;
        }
        if (this.copySuccessMsg) {
          this.copySuccessMsg.classList.add("hidden");
        }
        this.showModal(this.shareModal);
      });
    }

    if (this.closeShareModal) {
      this.closeShareModal.addEventListener("click", () => this.hideModal(this.shareModal));
    }

    if (this.copyShareUrlBtn && this.shareUrlInput) {
      this.copyShareUrlBtn.addEventListener("click", () => {
        this.shareUrlInput.select();
        navigator.clipboard.writeText(this.shareUrlInput.value)
          .then(() => {
            if (this.copySuccessMsg) {
              this.copySuccessMsg.classList.remove("hidden");
              setTimeout(() => this.copySuccessMsg.classList.add("hidden"), 3000);
            }
          })
          .catch(err => console.error("Could not copy link: ", err));
      });
    }

    // Privacy Checkbox Toggle
    if (this.photoIsPrivate && this.passwordInputGroup) {
      this.photoIsPrivate.addEventListener("change", (e) => {
        if (e.target.checked) {
          this.passwordInputGroup.classList.remove("hidden");
          if (this.photoPassword) this.photoPassword.required = true;
        } else {
          this.passwordInputGroup.classList.add("hidden");
          if (this.photoPassword) {
            this.photoPassword.required = false;
            this.photoPassword.value = "";
          }
        }
      });
    }

    // Unlock Modal Handlers
    if (this.closeUnlockModal) {
      this.closeUnlockModal.addEventListener("click", () => this.dismissUnlockModal());
    }
    if (this.cancelUnlockBtn) {
      this.cancelUnlockBtn.addEventListener("click", () => this.dismissUnlockModal());
    }

    if (this.unlockForm) {
      this.unlockForm.addEventListener("submit", (e) => this.handleUnlockSubmit(e));
    }

    // Upload Modal Handlers
    this.openUploadBtn.addEventListener("click", () => {
      this.hideUploadError();
      this.showModal(this.uploadModal);
    });
    this.closeUploadModal.addEventListener("click", () => this.hideModal(this.uploadModal));
    this.cancelUploadBtn.addEventListener("click", () => this.hideModal(this.uploadModal));

    // File Dropzone Drag & Drop Support
    ["dragenter", "dragover"].forEach(eventName => {
      this.dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add("dragover");
      }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
      this.dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove("dragover");
      }, false);
    });

    this.dropZone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        this.handleFileSelect(files[0]);
      }
    });

    this.photoFileInput.addEventListener("change", (e) => this.handleFileSelect(e.target.files[0]));
    this.removePreviewBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.resetFileInput();
    });

    this.uploadForm.addEventListener("submit", (e) => this.handlePhotoUpload(e));

    // Detail Modal Handlers
    this.closeDetailModal.addEventListener("click", () => this.hideModal(this.detailModal));
    this.detailLikeBtn.addEventListener("click", () => this.toggleLike(this.selectedPhotoId));
    this.detailDownloadBtn.addEventListener("click", () => this.downloadPhoto(this.selectedPhotoId));
    this.detailBookmarkBtn.addEventListener("click", () => this.toggleBookmark(this.selectedPhotoId));
    this.detailDeleteBtn.addEventListener("click", () => this.deletePhoto(this.selectedPhotoId));
    this.commentForm.addEventListener("submit", (e) => this.handleCommentSubmit(e));

    // Star Rating Event Listener
    if (this.starPicker) {
      this.starPicker.addEventListener("click", (e) => {
        const star = e.target.closest(".star-btn");
        if (star && this.selectedPhotoId) {
          const ratingVal = parseInt(star.dataset.rating, 10);
          this.ratePhoto(this.selectedPhotoId, ratingVal);
        }
      });

      this.starPicker.addEventListener("mouseover", (e) => {
        const star = e.target.closest(".star-btn");
        if (star) {
          const ratingVal = parseInt(star.dataset.rating, 10);
          this.starPicker.querySelectorAll(".star-btn").forEach(s => {
            const val = parseInt(s.dataset.rating, 10);
            if (val <= ratingVal) {
              s.classList.add("hover");
            } else {
              s.classList.remove("hover");
            }
          });
        }
      });

      this.starPicker.addEventListener("mouseleave", () => {
        this.starPicker.querySelectorAll(".star-btn").forEach(s => s.classList.remove("hover"));
      });
    }

    // Keyboard & Overlay Accessibility (Escape key to close active modal)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.shareModal && !this.shareModal.classList.contains("hidden")) this.hideModal(this.shareModal);
        if (this.unlockModal && !this.unlockModal.classList.contains("hidden")) this.dismissUnlockModal();
        if (!this.uploadModal.classList.contains("hidden")) this.hideModal(this.uploadModal);
        if (!this.detailModal.classList.contains("hidden")) this.hideModal(this.detailModal);
        if (!this.collectionsModal.classList.contains("hidden")) this.hideModal(this.collectionsModal);
      }

      if (e.key === "Tab") {
        const activeModal = [this.shareModal, this.unlockModal, this.uploadModal, this.detailModal, this.collectionsModal]
          .find(modal => modal && !modal.classList.contains("hidden"));
        if (activeModal) this.trapFocus(e, activeModal);
      }
    });

    [this.shareModal, this.unlockModal, this.uploadModal, this.detailModal, this.collectionsModal].filter(Boolean).forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target !== modal) return;
        if (modal === this.unlockModal) {
          this.dismissUnlockModal();
        } else {
          this.hideModal(modal);
        }
      });
    });
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  handleFileSelect(file) {
    if (!file) return;
    const validationMessage = this.getUploadFileValidationMessage(file);
    if (validationMessage) {
      this.resetFileInput();
      this.showUploadError(validationMessage);
      return;
    }

    this.hideUploadError();
  this.previewImageDataUrl = null;
  this.imagePreview.src = "";
  this.imagePreviewContainer.classList.add("hidden");
  this.dropZoneContent.classList.remove("hidden");
    this.selectedUploadFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (this.selectedUploadFile !== file) return;
      this.previewImageDataUrl = e.target.result;
      this.imagePreview.src = this.previewImageDataUrl;
      this.dropZoneContent.classList.add("hidden");
      this.imagePreviewContainer.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }

  resetFileInput() {
    this.previewImageDataUrl = null;
    this.selectedUploadFile = null;
    this.photoFileInput.value = "";
    this.imagePreview.src = "";
    this.imagePreviewContainer.classList.add("hidden");
    this.dropZoneContent.classList.remove("hidden");
    this.hideUploadError();
  }

  getUploadFileValidationMessage(file) {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!file || !allowedTypes.includes(file.type)) {
      return "Choose a PNG, JPEG, WEBP, or GIF image file.";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "Choose an image that is 10 MB or smaller.";
    }
    return "";
  }

  showUploadError(message) {
    this.uploadErrorMsg.textContent = message;
    this.uploadErrorMsg.classList.remove("hidden");
  }

  hideUploadError() {
    this.uploadErrorMsg.textContent = "";
    this.uploadErrorMsg.classList.add("hidden");
  }

  handlePhotoUpload(e) {
    e.preventDefault();
    const selectedFile = this.selectedUploadFile;
    const validationMessage = this.getUploadFileValidationMessage(selectedFile);
    if (validationMessage || !this.previewImageDataUrl) {
      this.showUploadError(validationMessage || "Wait for the image preview before publishing.");
      return;
    }

    const title = document.getElementById("photoTitle").value.trim();
    const author = document.getElementById("photoAuthor").value.trim();
    const category = document.getElementById("photoCategory").value;
    const tagsRaw = document.getElementById("photoTags").value;
    const description = document.getElementById("photoDescription").value.trim();
    const city = document.getElementById("photoCity").value.trim();
    const isPrivate = this.photoIsPrivate ? this.photoIsPrivate.checked : false;
    const password = (isPrivate && this.photoPassword) ? this.photoPassword.value.trim() : null;
    if (isPrivate && !password) {
      this.showUploadError("Set a non-empty access password for a private photo.");
      this.photoPassword.focus();
      return;
    }

    const tags = this.normalizeTags(tagsRaw || category.toLowerCase());

    const newPhoto = {
      id: "photo-" + Date.now(),
      title,
      author,
      category,
      imageUrl: this.previewImageDataUrl,
      description: description || "Published on Lumina Gallery.",
      tags,
      city,
      likes: 0,
      likedByMe: false,
      views: 0,
      isPrivate,
      password,
      createdAt: new Date().toISOString(),
      comments: []
    };

    const normalizedPhoto = this.normalizePhoto(newPhoto);
    if (!normalizedPhoto) {
      this.showUploadError("The selected image could not be published.");
      return;
    }

    this.photos.unshift(normalizedPhoto);
    this.savePhotos();
    this.uploadForm.reset();
    if (this.passwordInputGroup) this.passwordInputGroup.classList.add("hidden");
    this.resetFileInput();
    this.hideUploadError();
    this.hideModal(this.uploadModal);
    this.renderGallery();
  }

  promptUnlock(photoId, action) {
    this.pendingUnlockPhotoId = photoId;
    this.pendingUnlockAction = action;
    if (this.unlockPasswordInput) this.unlockPasswordInput.value = "";
    if (this.unlockErrorMsg) this.unlockErrorMsg.classList.add("hidden");
    this.showModal(this.unlockModal);
  }

  handleUnlockSubmit(e) {
    e.preventDefault();
    if (!this.pendingUnlockPhotoId) return;

    const photo = this.photos.find(p => p.id === this.pendingUnlockPhotoId);
    if (!photo) return;

    const enteredPassword = this.unlockPasswordInput ? this.unlockPasswordInput.value.trim() : "";
    const expectedPassword = photo.password;

    if (enteredPassword && enteredPassword === expectedPassword) {
      this.hideModal(this.unlockModal);
      const photoToActOn = this.pendingUnlockPhotoId;
      const action = this.pendingUnlockAction;
      this.pendingUnlockPhotoId = null;
      this.pendingUnlockAction = null;

      if (action === "download") {
        this.performDownload(photoToActOn);
      } else if (action === "like") {
        this.performToggleLike(photoToActOn);
      } else {
        this.performOpenDetailModal(photoToActOn);
      }
    } else {
      if (this.unlockErrorMsg) this.unlockErrorMsg.classList.remove("hidden");
    }
  }

  toggleLike(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;
    if (photo.isPrivate) {
      this.promptUnlock(photoId, "like");
      return;
    }
    this.performToggleLike(photoId);
  }

  performToggleLike(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;

    if (photo.likedByMe) {
      photo.likes -= 1;
      photo.likedByMe = false;
    } else {
      photo.likes += 1;
      photo.likedByMe = true;
    }

    this.savePhotos();
    this.renderGallery();

    if (this.selectedPhotoId === photoId) {
      this.updateDetailModalContent(photo);
    }
  }

  handleCommentSubmit(e) {
    e.preventDefault();
    if (!this.selectedPhotoId) return;

    const author = this.commentAuthorInput.value.trim();
    const text = this.commentTextInput.value.trim();

    if (!author || !text || text.length > MAX_COMMENT_LENGTH) return;

    const photo = this.photos.find(p => p.id === this.selectedPhotoId);
    if (!photo) return;

    const newComment = {
      id: "comment-" + Date.now(),
      author,
      text,
      createdAt: new Date().toISOString()
    };

    photo.comments.push(newComment);
    this.savePhotos();

    this.commentTextInput.value = "";
    this.updateDetailModalContent(photo);
    this.renderGallery();
  }

  downloadPhoto(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;

    if (photo.isPrivate) {
      this.promptUnlock(photoId, "download");
      return;
    }

    this.performDownload(photoId);
  }

  performDownload(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;

    // Create a temporary anchor to trigger file download
    const link = document.createElement("a");
    link.href = photo.imageUrl;
    link.download = `${photo.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toggleBookmark(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;

    photo.bookmarkedByMe = !photo.bookmarkedByMe;
    this.savePhotos();
    this.updateDetailModalContent(photo);
  }

  deletePhoto(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo || !confirm(`Delete "${photo.title}"? This cannot be undone.`)) return;

    this.photos = this.photos.filter(p => p.id !== photoId);
    this.recentlyViewed = this.recentlyViewed.filter(entry => entry.photoId !== photoId);
    this.collections.forEach(collection => {
      collection.photoIds = collection.photoIds.filter(id => id !== photoId);
      if (collection.coverPhotoId === photoId) collection.coverPhotoId = collection.photoIds[0] || null;
    });
    this.selectedPhotoId = null;
    this.savePhotos();
    this.saveCollections();
    this.saveRecentlyViewed();
    this.hideModal(this.detailModal);
    this.renderGallery();
  }

  /**
   * Calculates average rating for a photo object.
   * @param {Object} photo
   * @returns {number} Average score between 0 and 5.
   */
  getAverageRating(photo) {
    if (!photo || !photo.ratingCount || photo.ratingCount === 0) return 0;
    return photo.ratingSum / photo.ratingCount;
  }

  ratePhoto(photoId, score) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;

    if (!photo.myRating) {
      photo.ratingSum = (photo.ratingSum || 0) + score;
      photo.ratingCount = (photo.ratingCount || 0) + 1;
      photo.myRating = score;
    } else {
      photo.ratingSum = (photo.ratingSum || 0) - photo.myRating + score;
      photo.myRating = score;
    }

    this.savePhotos();
    this.renderGallery();

    if (this.selectedPhotoId === photoId) {
      this.updateDetailModalContent(photo);
    }
  }

  /**
   * Calculates the total number of likes across all photos in the gallery.
   * @returns {number} Sum of all photo likes.
   */
  getTotalLikes() {
    return this.photos.reduce((total, photo) => total + (photo.likes || 0), 0);
  }

  getFilteredPhotos() {
    let filtered = [...this.photos];

    // Category Filter
    if (this.currentCategory === "bookmarked") {
      filtered = filtered.filter(photo => photo.bookmarkedByMe);
    } else if (this.currentCategory === "recently-viewed") {
      const viewedAtByPhotoId = new Map(this.recentlyViewed.map(entry => [entry.photoId, entry.viewedAt]));
      filtered = filtered.filter(photo => viewedAtByPhotoId.has(photo.id));
    } else if (this.currentCategory !== "all") {
      filtered = filtered.filter(p => p.category.toLowerCase() === this.currentCategory.toLowerCase());
    }

    if (this.currentCity !== "all") {
      filtered = filtered.filter(photo => photo.city.toLowerCase() === this.currentCity.toLowerCase());
    }

    if (this.currentTag) {
      filtered = filtered.filter(photo => photo.tags.some(tag => tag.toLowerCase() === this.currentTag.toLowerCase()));
    }

    if (this.currentCollectionId !== "all") {
      const collection = this.collections.find(item => item.id === this.currentCollectionId);
      filtered = collection ? filtered.filter(photo => collection.photoIds.includes(photo.id)) : filtered;
    }

    // Search Query
    if (this.searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(this.searchQuery) ||
        p.author.toLowerCase().includes(this.searchQuery) ||
        p.category.toLowerCase().includes(this.searchQuery) ||
        p.city.toLowerCase().includes(this.searchQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(this.searchQuery))
      );
    }

    // Recently viewed is always ordered by its persisted view timestamp.
    if (this.currentCategory === "recently-viewed") {
      const viewedAtByPhotoId = new Map(this.recentlyViewed.map(entry => [entry.photoId, entry.viewedAt]));
      const viewedTimestampByPhotoId = new Map(
        filtered.map(photo => [photo.id, new Date(viewedAtByPhotoId.get(photo.id)).getTime()])
      );
      filtered.sort((a, b) => viewedTimestampByPhotoId.get(b.id) - viewedTimestampByPhotoId.get(a.id) || a.id.localeCompare(b.id));
    } else if (this.currentSort === "newest") {
      const createdTimestampByPhotoId = new Map(
        filtered.map(photo => [photo.id, new Date(photo.createdAt).getTime()])
      );
      filtered.sort((a, b) => createdTimestampByPhotoId.get(b.id) - createdTimestampByPhotoId.get(a.id));
    } else if (this.currentSort === "popular") {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (this.currentSort === "rating") {
      filtered.sort((a, b) => this.getAverageRating(b) - this.getAverageRating(a));
    } else if (this.currentSort === "views") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (this.currentSort === "comments") {
      filtered.sort((a, b) => b.comments.length - a.comments.length);
    }

    return filtered;
  }

  renderGallery() {
    const photos = this.getFilteredPhotos();
    this.updateSortAvailability();
    this.renderCityFilters();
    this.renderTagFilter();
    this.renderCollectionFilters();

    if (photos.length === 0) {
      this.galleryGrid.innerHTML = "";
      const selectedCollection = this.collections.find(collection => collection.id === this.currentCollectionId);
      this.noResults.querySelector("h3").textContent = selectedCollection ? "No photos in this collection" : "No photos found";
      this.noResults.querySelector("p").textContent = selectedCollection
        ? "Add photos to this collection from a photo's detail view."
        : "Try adjusting your search query, save a photo to your collection, or upload a new photo to get started!";
      this.noResults.classList.remove("hidden");
      return;
    }

    this.noResults.classList.add("hidden");
    this.galleryGrid.innerHTML = photos.map(photo => this.createCardHTML(photo)).join("");

  }

  updateSortAvailability() {
    const isRecentlyViewed = this.currentCategory === "recently-viewed";
    this.sortSelect.disabled = isRecentlyViewed;
    this.sortSelect.title = isRecentlyViewed ? "Recently viewed photos are ordered by viewing time." : "";
    this.sortSelect.setAttribute("aria-label", isRecentlyViewed ? "Sort disabled" : "Sort photos");
    this.sortSelect.setAttribute("aria-describedby", isRecentlyViewed ? "recentlyViewedOrderMessage" : "");
    this.recentlyViewedOrderMessage.classList.toggle("hidden", !isRecentlyViewed);
  }

  createCardHTML(photo) {
    const isLiked = photo.likedByMe;
    const isLocked = Boolean(photo.isPrivate);
    const thumbnailUrl = isLocked
      ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
      : photo.imageUrl;

    return `
      <article class="photo-card" data-id="${photo.id}">
        <button type="button" class="card-detail-btn" aria-label="View details for ${this.escapeHTML(photo.title)}">
        <div class="card-image-wrapper">
          <img src="${this.escapeHTML(thumbnailUrl)}" alt="${this.escapeHTML(photo.title)}" loading="lazy" class="${isLocked ? 'locked-img' : ''}" />
          <span class="card-category-badge">${this.escapeHTML(photo.category)}</span>
          ${photo.city ? `<span class="card-location-badge"><i class="fa-solid fa-location-dot"></i> ${this.escapeHTML(photo.city)}</span>` : ''}
          ${photo.isPrivate ? `<span class="card-lock-badge"><i class="fa-solid fa-lock"></i> Private</span>` : ''}
          ${isLocked ? `
            <div class="locked-thumb-overlay">
              <i class="fa-solid fa-lock"></i>
              <span>Locked Photo</span>
            </div>
          ` : ''}
        </div>
        </button>
        <div class="card-body">
          <h3 class="card-title">${this.escapeHTML(photo.title)} ${photo.isPrivate ? '<i class="fa-solid fa-lock" style="font-size:0.8rem; color:#f43f5e;" title="Private photo"></i>' : ''}</h3>
          <p class="card-author">by ${this.escapeHTML(photo.author)}</p>
          ${photo.tags.length ? `<div class="card-tags" aria-label="Photo tags">${photo.tags.map(tag => `<button type="button" class="card-tag-btn" data-tag="${this.escapeHTML(tag)}" aria-label="Filter by tag ${this.escapeHTML(tag)}">#${this.escapeHTML(tag)}</button>`).join("")}</div>` : ""}
          <div class="card-footer">
            <div class="card-stats">
              <span class="stat-item" title="Average Rating">
                <i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${this.getAverageRating(photo) > 0 ? this.getAverageRating(photo).toFixed(1) : 'New'}
              </span>
              <span class="stat-item" title="Views">
                <i class="fa-regular fa-eye"></i> ${(photo.views || 0).toLocaleString()}
              </span>
              <span class="stat-item ${isLiked ? 'liked' : ''}">
                <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i> ${photo.likes}
              </span>
              <span class="stat-item">
                <i class="fa-regular fa-comment"></i> ${photo.comments.length}
              </span>
            </div>
            <div class="card-actions">
              <button type="button" class="quick-action-btn quick-like-btn" aria-label="${isLiked ? "Unlike" : "Like"} ${this.escapeHTML(photo.title)}" title="${isLiked ? "Unlike" : "Like"} photo">
                <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart" style="${isLiked ? 'color: var(--accent-like)' : ''}"></i>
              </button>
              <button type="button" class="quick-action-btn quick-download-btn" aria-label="Download ${this.escapeHTML(photo.title)}" title="Download photo">
                <i class="fa-solid fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  renderCityFilters() {
    const cities = [...new Set(this.photos.map(photo => photo.city).filter(Boolean))]
      .sort((firstCity, secondCity) => firstCity.localeCompare(secondCity));

    if (!cities.includes(this.currentCity)) {
      this.currentCity = "all";
    }

    this.cityFilterContainer.innerHTML = [
      `<button type="button" class="category-chip city-chip ${this.currentCity === "all" ? "active" : ""}" data-city="all" aria-pressed="${this.currentCity === "all"}"><i class="fa-solid fa-location-dot"></i> All Cities</button>`,
      ...cities.map(city => `<button type="button" class="category-chip city-chip ${this.currentCity === city ? "active" : ""}" data-city="${this.escapeHTML(city)}" aria-pressed="${this.currentCity === city}"><i class="fa-solid fa-location-dot"></i> ${this.escapeHTML(city)}</button>`)
    ].join("");
  }

  renderTagFilter() {
    if (!this.currentTag) {
      this.tagFilterContainer.classList.add("hidden");
      this.tagFilterContainer.innerHTML = "";
      return;
    }

    this.tagFilterContainer.classList.remove("hidden");
    this.tagFilterContainer.innerHTML = `<span>Showing tag #${this.escapeHTML(this.currentTag)}</span><button type="button" class="category-chip clear-tag-filter-btn" aria-label="Clear tag filter">Clear tag</button>`;
  }

  renderCollectionFilters() {
    if (!this.collections.some(collection => collection.id === this.currentCollectionId)) {
      this.currentCollectionId = "all";
    }

    this.collectionFilterContainer.innerHTML = [
      `<button type="button" class="category-chip collection-chip ${this.currentCollectionId === "all" ? "active" : ""}" data-collection-id="all" aria-pressed="${this.currentCollectionId === "all"}"><i class="fa-solid fa-folder-open"></i> All Collections</button>`,
      ...this.collections.map(collection => `<button type="button" class="category-chip collection-chip ${this.currentCollectionId === collection.id ? "active" : ""}" data-collection-id="${this.escapeHTML(collection.id)}" aria-pressed="${this.currentCollectionId === collection.id}"><i class="fa-solid fa-folder"></i> ${this.escapeHTML(collection.name)}</button>`)
    ].join("");
  }

  createCollection(e) {
    e.preventDefault();
    const name = this.collectionNameInput.value.trim();
    const description = this.collectionDescriptionInput.value.trim();
    if (!name) return;
    if (this.collections.some(collection => collection.name.toLowerCase() === name.toLowerCase())) {
      this.collectionStatus.textContent = "A collection with this name already exists.";
      this.collectionNameInput.focus();
      return;
    }

    const collectionIdBase = `collection-${Date.now()}`;
    let collectionId = collectionIdBase;
    let suffix = 1;
    while (this.collections.some(collection => collection.id === collectionId)) {
      collectionId = `${collectionIdBase}-${suffix++}`;
    }

    this.collections.unshift({
      id: collectionId,
      name,
      description,
      coverPhotoId: null,
      photoIds: [],
      createdAt: new Date().toISOString()
    });
    this.saveCollections();
    this.collectionForm.reset();
    this.collectionStatus.textContent = "Collection created.";
    this.renderCollectionsList();
    this.renderGallery();
  }

  handleCollectionManagement(e) {
    const collectionItem = e.target.closest("[data-collection-id]");
    if (!collectionItem) return;
    const collection = this.collections.find(item => item.id === collectionItem.dataset.collectionId);
    if (!collection) return;

    if (e.target.closest(".rename-collection-btn")) {
      const name = prompt("Rename collection", collection.name);
      if (name === null) return;
      const normalizedName = name.trim();
      if (!normalizedName) {
        this.collectionStatus.textContent = "Collection name cannot be empty.";
        return;
      }
      if (this.collections.some(item => item.id !== collection.id && item.name.toLowerCase() === normalizedName.toLowerCase())) {
        this.collectionStatus.textContent = "A collection with this name already exists.";
        return;
      }
      collection.name = normalizedName;
      this.saveCollections();
      this.collectionStatus.textContent = "Collection renamed.";
    }

    if (e.target.closest(".delete-collection-btn")) {
      if (!confirm(`Delete collection "${collection.name}"? Photos will not be deleted.`)) return;
      this.collections = this.collections.filter(item => item.id !== collection.id);
      if (this.currentCollectionId === collection.id) this.currentCollectionId = "all";
      this.saveCollections();
      this.collectionStatus.textContent = "Collection deleted.";
    }

    this.renderCollectionsList();
    this.renderGallery();
    if (this.selectedPhotoId) this.updateDetailModalContent(this.photos.find(photo => photo.id === this.selectedPhotoId));
  }

  renderCollectionsList() {
    this.collectionsList.innerHTML = this.collections.length
      ? this.collections.map(collection => `
          <article class="collection-list-item" data-collection-id="${this.escapeHTML(collection.id)}">
            <div>
              <h3>${this.escapeHTML(collection.name)}</h3>
              <p>${this.escapeHTML(collection.description) || "No description"} <span>${collection.photoIds.length} photo${collection.photoIds.length === 1 ? "" : "s"}</span></p>
            </div>
            <div class="collection-item-actions">
              <button type="button" class="quick-action-btn rename-collection-btn" aria-label="Rename ${this.escapeHTML(collection.name)}" title="Rename collection"><i class="fa-solid fa-pen"></i></button>
              <button type="button" class="quick-action-btn delete-collection-btn" aria-label="Delete ${this.escapeHTML(collection.name)}" title="Delete collection"><i class="fa-solid fa-trash"></i></button>
            </div>
          </article>`).join("")
      : `<p class="collections-empty">No collections yet. Create one above to begin organizing photos.</p>`;
  }

  togglePhotoCollection(photoId, collectionId, shouldInclude) {
    const collection = this.collections.find(item => item.id === collectionId);
    if (!photoId || !collection) return;
    if (shouldInclude) {
      collection.photoIds = [...new Set([...collection.photoIds, photoId])];
      collection.coverPhotoId ||= photoId;
    } else {
      collection.photoIds = collection.photoIds.filter(id => id !== photoId);
      if (collection.coverPhotoId === photoId) collection.coverPhotoId = collection.photoIds[0] || null;
    }
    this.saveCollections();
    this.renderGallery();
    this.updateDetailModalContent(this.photos.find(photo => photo.id === photoId));
  }

  addPhotoTags(e) {
    e.preventDefault();
    const photo = this.photos.find(item => item.id === this.selectedPhotoId);
    const newTags = this.normalizeTags(this.detailTagInput.value);
    if (!photo || !newTags.length) {
      this.detailTagStatus.textContent = "Enter at least one tag.";
      return;
    }

    const originalCount = photo.tags.length;
    photo.tags = this.normalizeTags([...photo.tags, ...newTags]);
    this.detailTagInput.value = "";
    this.detailTagStatus.textContent = photo.tags.length === originalCount
      ? "Those tags are already on this photo."
      : "Tags updated.";
    this.savePhotos();
    this.renderGallery();
    this.updateDetailModalContent(photo);
  }

  removePhotoTag(photoId, tagToRemove) {
    const photo = this.photos.find(item => item.id === photoId);
    if (!photo) return;
    photo.tags = photo.tags.filter(tag => tag.toLowerCase() !== String(tagToRemove).toLowerCase());
    if (this.currentTag && this.currentTag.toLowerCase() === String(tagToRemove).toLowerCase()) {
      this.currentTag = null;
    }
    this.detailTagStatus.textContent = `Removed #${tagToRemove}.`;
    this.savePhotos();
    this.renderGallery();
    this.updateDetailModalContent(photo);
  }

  openDetailModal(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;
    if (photo.isPrivate) {
      this.promptUnlock(photoId, "open");
      return;
    }

    this.performOpenDetailModal(photoId);
  }

  performOpenDetailModal(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (!photo) return;

    this.recordRecentlyViewed(photoId);
    // Increment view count upon viewing detail modal
    photo.views = (photo.views || 0) + 1;
    this.savePhotos();
    this.renderGallery();

    this.selectedPhotoId = photoId;
    this.updateDetailModalContent(photo);
    this.showModal(this.detailModal);
  }

  updateDetailModalContent(photo) {
    if (!photo) return;
    this.detailImg.src = photo.imageUrl;
    this.detailImg.alt = photo.title;
    this.detailTitle.textContent = photo.title;
    this.detailAuthor.textContent = photo.author;
    this.detailAvatar.textContent = photo.author.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "P";
    this.detailDate.textContent = new Date(photo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    this.detailDescription.textContent = photo.description;

    this.detailTags.innerHTML = photo.tags.map(tag => `
      <span class="tag-badge">#${this.escapeHTML(tag)}
        <button type="button" class="remove-tag-btn" data-tag="${this.escapeHTML(tag)}" aria-label="Remove tag ${this.escapeHTML(tag)}" title="Remove tag ${this.escapeHTML(tag)}"><i class="fa-solid fa-xmark"></i></button>
      </span>`).join("");
    this.photoCollectionsEmpty.classList.toggle("hidden", this.collections.length > 0);
    this.photoCollectionMemberships.innerHTML = this.collections.map(collection => `
      <label class="photo-collection-option">
        <input type="checkbox" class="photo-collection-checkbox" data-collection-id="${this.escapeHTML(collection.id)}" ${collection.photoIds.includes(photo.id) ? "checked" : ""} />
        <span>${this.escapeHTML(collection.name)}</span>
      </label>`).join("");

    if (this.detailViewsCount) {
      this.detailViewsCount.textContent = (photo.views || 0).toLocaleString();
    }

    const avgRating = this.getAverageRating(photo);
    if (this.detailAvgRating) {
      this.detailAvgRating.textContent = avgRating > 0 ? avgRating.toFixed(1) : "0.0";
    }
    if (this.detailRatingCount) {
      this.detailRatingCount.textContent = (photo.ratingCount || 0).toLocaleString();
    }
    if (this.starPicker) {
      const myRating = photo.myRating || 0;
      this.starPicker.querySelectorAll(".star-btn").forEach(star => {
        const val = parseInt(star.dataset.rating, 10);
        star.classList.toggle("active", val <= myRating);
        star.setAttribute("aria-pressed", String(val === myRating));
        star.querySelector("i").className = `${val <= myRating ? "fa-solid" : "fa-regular"} fa-star`;
      });
    }

    this.detailLikeCount.textContent = photo.likes;
    if (photo.likedByMe) {
      this.detailLikeBtn.classList.add("liked");
      this.detailLikeIcon.className = "fa-solid fa-heart";
    } else {
      this.detailLikeBtn.classList.remove("liked");
      this.detailLikeIcon.className = "fa-regular fa-heart";
    }

    const isBookmarked = Boolean(photo.bookmarkedByMe);
    this.detailBookmarkBtn.classList.toggle("bookmarked", isBookmarked);
    this.detailBookmarkBtn.setAttribute("aria-pressed", String(isBookmarked));
    this.detailBookmarkBtn.setAttribute("aria-label", isBookmarked ? "Remove bookmark" : "Bookmark photo");
    this.detailBookmarkBtn.title = isBookmarked ? "Remove bookmark" : "Bookmark photo";
    this.detailBookmarkIcon.className = `${isBookmarked ? "fa-solid" : "fa-regular"} fa-bookmark`;

    this.detailCommentCount.textContent = photo.comments.length;
    this.commentsList.innerHTML = photo.comments.length > 0
      ? photo.comments.map(c => `
          <div class="comment-card">
            <div class="comment-author-line">
              <span>${this.escapeHTML(c.author)}</span>
              <span class="comment-time">${new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="comment-text">${this.escapeHTML(c.text)}</p>
          </div>
        `).join("")
      : `<p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">No comments yet. Be the first to share your thoughts!</p>`;
  }

  showModal(modal) {
    this.lastFocusedElement = document.activeElement;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    const focusableElements = this.getFocusableElements(modal);
    if (focusableElements.length) focusableElements[0].focus();
  }

  hideModal(modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    if (modal === this.detailModal) {
      this.selectedPhotoId = null;
      this.detailImg.src = "";
    }
    if (this.lastFocusedElement instanceof HTMLElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  // Dismiss unlock modal without submitting, clearing any pending unlock state
  dismissUnlockModal() {
    this.hideModal(this.unlockModal);
    this.pendingUnlockPhotoId = null;
    this.pendingUnlockAction = null;
  }

  getFocusableElements(container) {
    return [...container.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')]
      .filter(element => !element.closest(".hidden"));
  }

  trapFocus(e, modal) {
    const focusableElements = this.getFocusableElements(modal);
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  normalizeTags(tags) {
    const tagValues = Array.isArray(tags) ? tags : String(tags || "").split(",");
    const seen = new Set();

    return tagValues.reduce((normalizedTags, tag) => {
      const trimmedTag = String(tag).trim();
      const tagKey = trimmedTag.toLowerCase();
      if (trimmedTag && !seen.has(tagKey)) {
        seen.add(tagKey);
        normalizedTags.push(trimmedTag);
      }
      return normalizedTags;
    }, []);
  }

  normalizePhoto(photo) {
    if (!photo || typeof photo !== "object") return null;

    const id = typeof photo.id === "string" ? photo.id.trim() : "";
    const imageUrl = typeof photo.imageUrl === "string" ? photo.imageUrl.trim() : "";
    const title = typeof photo.title === "string" ? photo.title.trim() : "";
    const author = typeof photo.author === "string" ? photo.author.trim() : "";
    const category = typeof photo.category === "string" ? photo.category.trim() : "";
    if (!/^[A-Za-z0-9_-]+$/.test(id) || !title || !author || !category || !this.isSafeImageUrl(imageUrl)) return null;

    const number = (value, fallback = 0) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : fallback;
    const count = value => Math.floor(number(value));
    const ratingCount = count(photo.ratingCount);
    const isPrivate = Boolean(photo.isPrivate);
    const password = typeof photo.password === "string" ? photo.password.trim() : "";
    if (isPrivate && !password) return null;

    return {
      id,
      title,
      author,
      category,
      imageUrl: imageUrl.startsWith("data:") ? imageUrl : new URL(imageUrl).href,
      description: typeof photo.description === "string" && photo.description.trim() ? photo.description.trim() : "Published on Lumina Gallery.",
      tags: this.normalizeTags(photo.tags),
      city: typeof photo.city === "string" ? photo.city.trim() : "",
      likes: count(photo.likes),
      likedByMe: Boolean(photo.likedByMe),
      views: count(photo.views),
      ratingSum: Math.min(number(photo.ratingSum), ratingCount * 5),
      ratingCount,
      myRating: Math.min(5, count(photo.myRating)),
      bookmarkedByMe: Boolean(photo.bookmarkedByMe),
      isPrivate,
      password: isPrivate ? password : null,
      createdAt: typeof photo.createdAt === "string" && !Number.isNaN(Date.parse(photo.createdAt)) ? photo.createdAt : new Date().toISOString(),
      comments: Array.isArray(photo.comments) ? photo.comments.map(comment => this.normalizeComment(comment)).filter(Boolean) : []
    };
  }

  normalizeComment(comment) {
    if (!comment || typeof comment !== "object") return null;
    const author = typeof comment.author === "string" ? comment.author.trim() : "";
    const text = typeof comment.text === "string" ? comment.text.trim() : "";
    if (!author || !text) return null;
    return {
      id: typeof comment.id === "string" && /^[A-Za-z0-9_-]+$/.test(comment.id) ? comment.id : `comment-${Date.now()}`,
      author,
      text: text.slice(0, MAX_COMMENT_LENGTH),
      createdAt: typeof comment.createdAt === "string" && !Number.isNaN(Date.parse(comment.createdAt)) ? comment.createdAt : new Date().toISOString()
    };
  }

  isSafeImageUrl(imageUrl) {
    if (/^data:image\/(png|jpeg|webp|gif);base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/i.test(imageUrl)) return true;
    try {
      const url = new URL(imageUrl);
      return url.protocol === "https:"
        && url.hostname === "images.unsplash.com"
        && !url.username
        && !url.password
        && !url.port;
    } catch {
      return false;
    }
  }

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { GalleryApp, MAX_COMMENT_LENGTH };
}

// Initialize on DOM Ready
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.galleryApp = new GalleryApp();
  });
}
