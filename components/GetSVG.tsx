import { svg_name } from '@/types';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

interface Props {
    name: svg_name;
    props: SvgProps;
}

const GetSVG:React.FC<Props> = ({name, props}) => {

    switch (name) {
        case "textlogo":
            
        return (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={212.224}
    height={61.165}
    viewBox="0 0 56.151 16.183"
    {...props}
  >
    <G
      style={{
        fill: "red",
        fillOpacity: 1,
      }}
    >
      <Path
        d="M523.113-137.04c-.304 2.078-.407 4.214-.559 6.308.75-.595 1.466-1.21 2.31-1.676-.147-.256-.38-.412-.586-.613 1.828 0 3.708-.566 5.532-.383.53.053 1.055.193 1.54.417.553.256 1.048.595 1.682.579.641-.016 1.18-.456 1.785-.613 1.52-.395 3.22-.155 4.448.865-1.602-.295-3.433.31-4.796 1.12-.916.546-1.681 1.224-2.69 1.606v.01c1.9-.208 3.662-.62 5.402-1.424-.405 1.056-1.223 1.868-2.187 2.45-.77.467-1.537.652-2.078 1.447-.69 1.013-.38 2.073-.61 3.188-.157.757-.445 1.513-.925 2.125-.224.288-.515.505-.754.777h8.666c.353-5.428 1.121-11.232 1.417-16.18z"
        style={{
          fill: "red",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 0.05,
          strokeDasharray: "none",
        }}
        transform="translate(-522.554 137.04)"
      />
      <Path
        d="M2223.43 1941.433q.289-1.664 1.217-2.96.928-1.312 2.336-2.032 1.408-.736 3.072-.736 1.392 0 2.432.512t1.616 1.456q.576.944.624 2.224h-3.376q-.192-.624-.672-.96-.48-.336-1.184-.336-1.088 0-1.872.768t-1.008 2.064q-.064.336-.064.72 0 .992.512 1.568.528.56 1.44.56.704 0 1.296-.336.608-.336 1.008-.96h3.392q-.768 1.936-2.416 3.072-1.648 1.12-3.76 1.12-1.456 0-2.528-.56-1.056-.56-1.616-1.584t-.56-2.368q0-.624.112-1.232zm17.736-5.616q1.776 0 2.704.8.928.784.928 2.096 0 .4-.064.72-.192 1.152-.976 2.032-.784.864-2.08 1.232l1.76 4.4h-3.488l-1.504-4.16h-.336l-.736 4.16h-3.152l2-11.28zm-2.672 4.976h1.552q1.248 0 1.472-1.184.032-.192.032-.272 0-.432-.288-.672-.272-.24-.816-.24h-1.552zm13.063 4.464h-4l-.928 1.84h-3.296l6.096-11.28h3.616l2.112 11.28h-3.312zm-.368-2.384-.56-3.664-1.856 3.664zm16.359-7.056-1.984 11.28h-3.152l.8-4.528h-3.808l-.8 4.528h-3.152l2-11.28h3.136l-.752 4.256h3.824l.752-4.256z"
        aria-label="CRAH"
        style={{
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: 16,
          lineHeight: 1.25,
          fontFamily: "Poppins",
          InkscapeFontSpecification: "&quot",
          letterSpacing: "-.712947px",
          wordSpacing: 0,
          whiteSpace: "pre",
          strokeWidth: 0.349483,
        }}
        transform="matrix(.75707 0 0 .75707 -1660.538 -1461.306)"
      />
    </G>
  </Svg>
        );
    
        default:
    return (
        <View>
            
        </View>
    );
    }
}

const GetSVGMemo = memo(GetSVG)
export default GetSVGMemo;
