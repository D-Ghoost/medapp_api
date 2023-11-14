import QRCode from 'qrcode';

const generateQR = async ( info ) => {
    try {
      return await QRCode.toDataURL( info ); 
    } catch (err) {
      console.error('QR: ', err)
    }
};

export default generateQR;