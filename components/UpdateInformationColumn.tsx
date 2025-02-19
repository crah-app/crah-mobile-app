import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Column from '@/components/general/column';

interface UpdateInformationColumnProps {
  updateNumber: number;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

const UpdateInformationColumn: React.FC<UpdateInformationColumnProps> = ({
  updateNumber,
  title,
  subtitle,
  onPress,
}) => {
  const theme = useSystemTheme();

  const numberComponent = (
    <View
      style={[
        styles.numberContainer,
        {
          borderColor: Colors[theme].textPrimary,
          borderWidth: 2,
        },
      ]}
    >
      <Text style={[styles.numberText, { color: Colors[theme].textPrimary }]}>
        {updateNumber}
      </Text>
    </View>
  );

  return (
    <Column
      title={title}
      subtitle={subtitle}
      customLeftComponent={numberComponent}
      showAvatar={false}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  numberContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateInformationColumn;
