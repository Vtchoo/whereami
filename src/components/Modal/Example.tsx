import { useState } from "react"
import Modal from "."

function ModalExample() {

    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button onClick={() => setShowModal(true)}>Show Modal</button>
            {showModal &&
                <Modal>
                    <div style={{ overflowY: 'auto', backgroundColor: 'white', margin: '50px', alignSelf: 'stretch', flex: 1 }}>
                        <h2 style={{ cursor: 'pointer', color: 'red' }} onClick={() => setShowModal(false)}>X Close modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                        <h2>Custom modal</h2>
                    </div>
                </Modal>
            }
        </>
    )
}

export { ModalExample }