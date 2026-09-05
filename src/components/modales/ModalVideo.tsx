import Modal from '../ui/Modal';
import Icon from '../ui/Icon';
import MagneticButton from '../ui/MagneticButton';
import { CONTACT } from '../../data/site';

/** Modal con el video de presentacion de la empresa. */
export default function ModalVideo({ onClose }: { onClose: () => void }) {
  return (
    <Modal titulo="Conoce LINKDICOM" onClose={onClose} className="modal--video" ancho="880px">
      <div className="video-modal">
        <div className="video-modal__cabeza">
          <span className="video-modal__icono">
            <Icon name="play" size={20} />
          </span>
          <div>
            <p className="video-modal__titulo">Conoce LINKDICOM</p>
            <p className="video-modal__nota">
              Descubre cómo nuestras soluciones están transformando la salud.
            </p>
          </div>
        </div>

        {/*
          El video se descarga solo cuando se abre el modal, no con la pagina.
          Arranca solo porque el visitante ya pulso para verlo.
        */}
        <video
          className="video-modal__player"
          src="/video/linkdicom-presentacion.mp4"
          poster="/video/portada.jpg"
          controls
          autoPlay
          playsInline
          preload="metadata"
        >
          Tu navegador no puede reproducir este video.
        </video>

        <div className="video-modal__pie">
          <span className="video-modal__icono video-modal__icono--sec">
            <Icon name="building" size={20} strokeWidth={1.7} />
          </span>
          <div>
            <p className="video-modal__titulo">Más de 200 instituciones confían en nosotros</p>
            <p className="video-modal__nota">
              En LINKDICOM desarrollamos soluciones tecnológicas integradas que optimizan procesos,
              mejoran la experiencia del paciente y generan resultados reales.
            </p>
          </div>
        </div>

        <MagneticButton
          href={CONTACT.whatsapp}
          target="_blank"
          className="btn btn--primary btn--square btn--lg video-modal__cta"
          block
          strength={0.16}
        >
          <span className="video-modal__cta-icono">
            <Icon name="headset" size={18} strokeWidth={1.8} />
          </span>
          Contactar a LINKDICOM
          <span className="btn__arrow">
            <Icon name="arrow-right" size={17} strokeWidth={2.2} />
          </span>
        </MagneticButton>
      </div>
    </Modal>
  );
}
