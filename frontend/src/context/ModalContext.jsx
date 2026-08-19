import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/Modal';

const ModalCtx = createContext(null);

export function ModalProvider({ children }) {
  const [state, setState] = useState(null); // { config, resolve }
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => {
    setState(null);
    setLoading(false);
  }, []);

  // showModal({ type, variant, title, message, confirmText, cancelText, onConfirm })
  const showModal = useCallback((config) => {
    return new Promise((resolve) => {
      setState({ config, resolve });
    });
  }, []);

  // shortcut: showAlert("Saved!", { variant: 'success', title: 'Done' })
  const showAlert = useCallback((message, opts = {}) => {
    return showModal({
      type: 'alert',
      variant: opts.variant || 'info',
      title: opts.title || 'Notice',
      message,
      confirmText: opts.confirmText || 'OK',
    });
  }, [showModal]);

  // shortcut: showConfirm("Delete this?", { variant: 'danger' })
  const showConfirm = useCallback((message, opts = {}) => {
    return showModal({
      type: 'confirm',
      variant: opts.variant || 'danger',
      title: opts.title || 'Are you sure?',
      message,
      confirmText: opts.confirmText || 'Confirm',
      cancelText: opts.cancelText || 'Cancel',
      icon: opts.icon,
    });
  }, [showModal]);

  const handleConfirm = async () => {
    if (state?.config.asyncConfirm) {
      // supports awaiting an API call before closing
      setLoading(true);
      try {
        await state.config.asyncConfirm();
        state.resolve(true);
        close();
      } catch (e) {
        setLoading(false);
        // keep modal open on failure, let caller show error separately
      }
    } else {
      state.resolve(true);
      close();
    }
  };

  const handleClose = () => {
    state?.resolve(false);
    close();
  };

  return (
    <ModalCtx.Provider value={{ showModal, showAlert, showConfirm }}>
      {children}
      {state && (
        <Modal
          open={!!state}
          type={state.config.type}
          variant={state.config.variant}
          icon={state.config.icon}
          title={state.config.title}
          message={state.config.message}
          confirmText={state.config.confirmText}
          cancelText={state.config.cancelText}
          loading={loading}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      )}
    </ModalCtx.Provider>
  );
}

export const useModal = () => useContext(ModalCtx);