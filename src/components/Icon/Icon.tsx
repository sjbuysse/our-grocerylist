import React from 'react';

interface IconProps {
    icon: string,
    size?: number,
    color?: string,
}

// find icons here https://icomoon.io/app/#/select and click on generate SVG on the bottom of the page
const Icon: React.SFC<IconProps> = (props: IconProps) => {
    const styles = {
        svg: {
            display: 'inline-block',
            verticalAlign: 'middle',
        },
        path: {
            fill: props.color,
        },
    };

    return (
        <svg
            style={styles.svg}
            width={`${props.size}px`}
            height={`${props.size}px`}
            viewBox="0 0 1024 1024"
        >
            <path style={styles.path}
                  d={props.icon}/>
        </svg>
    );
};

Icon.defaultProps = {
    size: 16,
};

export default Icon;