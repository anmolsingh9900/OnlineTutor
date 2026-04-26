import { useState } from 'react';
import './Popup.css';

/**
 * Custom Popup Component
 * Types: 'alert', 'confirm', 'modal'
 */
export function usePopup() {
  const [popup, setPopup] = useState(null);

  const showAlert = (message, title = '⚠️ Alert') => {
    return new Promise((resolve) => {
      setPopup({
        type: 'alert',
        title,
        message,
        onClose: () => {
          setPopup(null);
          resolve(true);
        }
      });
    });
  };

  const showConfirm = (message, title = '❓ Confirm') => {
    return new Promise((resolve) => {
      setPopup({
        type: 'confirm',
        title,
        message,
        onConfirm: () => {
          setPopup(null);
          resolve(true);
        },
        onCancel: () => {
          setPopup(null);
          resolve(false);
        }
      });
    });
  };

  const showModal = (content, title = '📋 Modal', options = {}) => {
    return new Promise((resolve) => {
      setPopup({
        type: 'modal',
        title,
        content,
        onClose: () => {
          setPopup(null);
          resolve(null);
        },
        ...options
      });
    });
  };

  const closePopup = () => {
    setPopup(null);
  };

  return {
    popup,
    showAlert,
    showConfirm,
    showModal,
    closePopup
  };
}

export function PopupProvider({ popup, closePopup }) {
  if (!popup) return null;

  if (popup.type === 'alert') {
    return (
      <div className="PopupOverlay" onClick={popup.onClose}>
        <div className="PopupWindow" onClick={(e) => e.stopPropagation()}>
          <div className="PopupHeader">
            <h3>{popup.title}</h3>
            <button className="PopupClose" onClick={popup.onClose}>✕</button>
          </div>
          <div className="PopupBody">
            <p>{popup.message}</p>
          </div>
          <div className="PopupFooter">
            <button className="PopupBtn PopupBtnPrimary" onClick={popup.onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (popup.type === 'confirm') {
    return (
      <div className="PopupOverlay" onClick={popup.onCancel}>
        <div className="PopupWindow" onClick={(e) => e.stopPropagation()}>
          <div className="PopupHeader">
            <h3>{popup.title}</h3>
            <button className="PopupClose" onClick={popup.onCancel}>✕</button>
          </div>
          <div className="PopupBody">
            <p>{popup.message}</p>
          </div>
          <div className="PopupFooter">
            <button className="PopupBtn PopupBtnSecondary" onClick={popup.onCancel}>
              Cancel
            </button>
            <button className="PopupBtn PopupBtnPrimary" onClick={popup.onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (popup.type === 'modal') {
    return (
      <div className="PopupOverlay" onClick={popup.onClose}>
        <div className="PopupWindow PopupWindowLarge" onClick={(e) => e.stopPropagation()}>
          <div className="PopupHeader">
            <h3>{popup.title}</h3>
            <button className="PopupClose" onClick={popup.onClose}>✕</button>
          </div>
          <div className="PopupBody">
            {popup.content}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
