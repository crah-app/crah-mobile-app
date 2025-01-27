import { StyleSheet, View, Image, ImageStyle } from 'react-native';
import UserImageCircle from './UserImageCircle';

interface LeaderBoardUserCircleProps {
  width: number;
  height: number;
  rank: number;
  imageUri: string;
  style?: ImageStyle | ImageStyle[];
}

const LeaderBoardUserCircle: React.FC<LeaderBoardUserCircleProps> = ({
  width,
  height,
  rank,
  imageUri,
  style,
}) => {
  return (
    <UserImageCircle
      width={width}
      height={height}
      imageUri={imageUri}
      style={[styles.image, style]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    borderWidth: 0,
  },
});

export default LeaderBoardUserCircle;
