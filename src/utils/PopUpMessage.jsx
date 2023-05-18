import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const errorPopup = (message) => {
    toast.error(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export const successPopup = (message) => {
    toast.success(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export const warningPopup = (message) => {
    toast.warn(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}

export const resolveAfterSec = new Promise(resolve => setTimeout(resolve, 15000));
export const loadingPopup = (message) => {
    toast.promise(
        resolveAfterSec,
        {
          position: "bottom-right",
          pending: 'Transaction is pending 👌',
          //success: 'Promise resolved ',
          //error: 'Promise rejected 🤯'
        }
    )
}