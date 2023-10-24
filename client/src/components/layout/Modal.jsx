import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Modal = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-800 opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg z-50">

                <div className="w-full flex justify-end">
                    <h1></h1>
                    <button onClick={onClose} className=" bg-red-500 text-white px-3 py-1 rounded">
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </div>

                <div>
                    <button>Edit Profile Picture</button>

                </div>

            </div>
        </div>
    );
};

export default Modal;
