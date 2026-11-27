(() => {
  "use strict";

  const PRICE = 1350;
  const STORAGE_KEY = "jekky_womens_sunglasses_basket_v1";
  const WHATSAPP_NUMBER = "79146209617";
  const $ = (id) => document.getElementById(id);

  let basket = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) basket = saved.filter(x =>
      x && Number.isInteger(Number(x.model)) && Number(x.model) >= 1 &&
      Number(x.model) <= 26 && Number.isInteger(Number(x.qty)) && Number(x.qty) > 0
    ).map(x => ({ model: Number(x.model), qty: Math.min(20, Number(x.qty)) }));
  } catch (_) { basket = []; }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(basket)); } catch (_) {}
  }

  function totalCount() {
    return basket.reduce((sum, item) => sum + item.qty, 0);
  }

  function render() {
    const count = $("basket-count");
    const list = $("basket-items");
    const total = basket.reduce((sum, item) => sum + item.qty * PRICE, 0);
    if (count) count.textContent = String(totalCount());
    if ($("basket-total")) $("basket-total").textContent = total.toLocaleString("ru-RU") + " руб.";
    if (!list) return;

    if (!basket.length) {
      list.innerHTML = '<p class="basket-empty">Корзина пока пуста. Выберите понравившиеся очки.</p>';
      return;
    }

    list.replaceChildren();
    basket.forEach(item => {
      const row = document.createElement("div");
      row.className = "basket-item";
      const img = document.createElement("img");
      img.src = `./image/womanspolar (${item.model}).png`;
      img.alt = `Модель ${item.model}`;
      img.loading = "lazy";

      const info = document.createElement("div");
      info.className = "basket-item-info";
      const name = document.createElement("strong");
      name.textContent = `Женские очки — модель ${item.model}`;
      const price = document.createElement("span");
      price.textContent = `${PRICE.toLocaleString("ru-RU")} руб. × ${item.qty} = ${(PRICE * item.qty).toLocaleString("ru-RU")} руб.`;
      info.append(name, price);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "basket-remove";
      remove.textContent = "Удалить";
      remove.setAttribute("aria-label", `Удалить модель ${item.model}`);
      remove.addEventListener("click", () => {
        basket = basket.filter(x => x.model !== item.model);
        save(); render();
        setStatus("Товар удалён из корзины.", "success");
      });

      row.append(img, info, remove);
      list.append(row);
    });
  }

  function setStatus(message, type) {
    const status = $("basket-status");
    if (!status) return;
    status.textContent = message;
    status.className = `basket-status ${type || ""}`;
  }

  function currentModel() {
    return Math.max(1, Math.min(26, Number(window.currentSlide) || 1));
  }

  function addCurrentModel() {
    const model = currentModel();
    const existing = basket.find(x => x.model === model);
    if (existing) existing.qty = Math.min(20, existing.qty + 1);
    else basket.push({ model, qty: 1 });
    save(); render();
    const feedback = $("choose-feedback");
    if (feedback) {
      feedback.textContent = `✓ Модель ${model} добавлена в корзину`;
      feedback.classList.add("is-visible");
    }
    const toggle = $("basket-toggle");
    if (toggle) toggle.classList.add("basket-has-items");
  }

  function buildOrderText() {
    const lines = basket.map(item =>
      `Модель ${item.model} — ${item.qty} шт. × ${PRICE} руб. = ${item.qty * PRICE} руб.`
    );
    const total = basket.reduce((sum, item) => sum + item.qty * PRICE, 0);
    const name = $("customer-name")?.value.trim() || "Не указано";
    const contact = $("customer-contact")?.value.trim() || "Не указан";
    return `Здравствуйте! Хочу оформить заказ в Jekky.\n\n${lines.join("\n")}\n\nИтого: ${total} руб.\nИмя: ${name}\nКонтакт: ${contact}`;
  }

  function openBasket() {
    const panel = $("basket-panel");
    const toggle = $("basket-toggle");
    if (!panel || !toggle) return;
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }
  function closeBasket() {
    const panel = $("basket-panel");
    const toggle = $("basket-toggle");
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    $("basket-toggle")?.addEventListener("click", () => {
      if ($("basket-panel").hidden) openBasket(); else closeBasket();
    });
    $("basket-close")?.addEventListener("click", closeBasket);
    $("choose-current-button")?.addEventListener("click", addCurrentModel);

    $("send-whatsapp")?.addEventListener("click", () => {
      if (!basket.length) { setStatus("Сначала добавьте очки в корзину.", "error"); return; }
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderText())}`;
      window.open(url, "_blank", "noopener");
    });

    $("basket-order-form")?.addEventListener("submit", async event => {
      event.preventDefault();
      if (!basket.length) { setStatus("Корзина пуста.", "error"); return; }
      const name = $("customer-name").value.trim();
      const contact = $("customer-contact").value.trim();
      if (!name || !contact) {
        setStatus("Пожалуйста, укажите имя и телефон или email для связи.", "error");
        return;
      }
      const button = $("send-email");
      button.disabled = true;
      button.textContent = "Отправляем...";
      setStatus("Отправка заказа на электронную почту…", "");
      try {
        const response = await fetch("send-order.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, contact, items: basket })
        });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.message || "Не удалось отправить заказ.");
        setStatus("Заказ успешно отправлен на электронную почту. Спасибо!", "success");
        basket = [];
        save(); render();
      } catch (error) {
        setStatus(error.message || "Ошибка отправки. Проверьте настройки PHP/SMTP.", "error");
      } finally {
        button.disabled = false;
        button.textContent = "Отправить на email";
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeBasket();
    });
  });

  // Keep accessible for any old inline handlers elsewhere on this page.
  window.addToBasket = function(orderId, photoId) {
    const match = String(orderId || "").match(/\d+/);
    const model = match ? Number(match[0]) : currentModel();
    if (model >= 1 && model <= 26) {
      window.currentSlide = model;
      addCurrentModel();
    }
  };
  window.sendBasketToWhatsApp = () => {
    if (!basket.length) { openBasket(); setStatus("Сначала добавьте очки в корзину.", "error"); return; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderText())}`, "_blank", "noopener");
  };
})();