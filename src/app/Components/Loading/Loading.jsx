import { ThreeCircles } from 'react-loader-spinner';

const Loading = () => {
    return (
        <div className='flex flex-col justify-center items-center my-16'>
        <ThreeCircles
        visible={true}
        height="50"
        width="50"
        color="#0000FF"
        ariaLabel="three-circles-loading"
      />
        </div>
    );
};

export default Loading;