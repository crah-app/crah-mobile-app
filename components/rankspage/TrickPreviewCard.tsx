import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import ThemedText from '../general/ThemedText';
import Colors from '@/constants/Colors';
import { SvgXml } from 'react-native-svg';

import Scooter from '../../assets/images/vectors/scooter.svg';
import Row from '../general/Row';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { format } from 'date-fns';
import { SpotInterface } from '@/types';

interface TrickPreviewProps {
	theme: 'dark' | 'light';
	trickName: string;
	userId: string | undefined;
	spots: SpotInterface[];
}

const TrickPreviewCard: React.FC<TrickPreviewProps> = ({
	theme,
	trickName,
	userId,
	spots,
}) => {
	return (
		<View
			style={{
				width: '100%',
				flexDirection: 'column',
				gap: 12,
			}}>
			<View style={{ width: '100%', flexDirection: 'row' }}>
				<ThemedText
					style={{ fontWeight: '600', fontSize: 18 }}
					theme={theme}
					value={`${trickName}`}
				/>
				<ThemedText
					style={{ fontSize: 18 }}
					theme={theme}
					value={' - Your Preview'}
				/>
			</View>

			<View
				style={{
					backgroundColor: Colors[theme].container_surface,
					height: 250,
					width: '100%',
					borderRadius: 8,
					padding: 12,
					flexDirection: 'row',
				}}>
				{/* left side */}
				<View style={{ width: '50%' }}>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							height: '75%',
						}}>
						<SvgXml
							xml={Scooter}
							fill={Colors[theme].textPrimary}
							height={70}
							width={70}
						/>
					</View>

					<View>
						<ThemedText theme={theme} value={'Hardest Spot'} />
						<ThemedText theme={theme} value={'First time landed'} />
					</View>
				</View>

				{/* right side */}
				<View
					style={{
						width: '50%',
						borderLeftColor: Colors[theme].gray,
						borderLeftWidth: StyleSheet.hairlineWidth,
						paddingLeft: 12,
					}}>
					{/* header */}
					<View
						style={{
							height: '10%',
							alignItems: 'center',
							justifyContent: 'flex-end',
							flexDirection: 'row',
						}}>
						<TouchableOpacity>
							<Ionicons
								name={'attach-outline'}
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					</View>

					<View style={{ height: '65%' }}>
						{/* points section */}
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 12,
								marginBottom: 4,
							}}>
							<ThemedText
								style={[
									{
										fontSize: 42,
										fontWeight: '900',
										color: Colors[theme].primary,
									},
								]}
								theme={theme}
								value={'430'}
							/>
							<ThemedText
								theme={theme}
								value={'points'}
								style={{ color: Colors[theme].primary }}
							/>
						</View>

						{/* trick info */}
						<View>
							<ThemedText
								theme={theme}
								value={'Overhead'}
								style={[defaultStyles.outlinedBtn]}
							/>
						</View>

						{/* personal info */}
						<View style={{ marginTop: 12 }}>
							<Row
								leftContainerStyle={{ marginRight: 0 }}
								containerStyle={{
									padding: 0,
									width: '100%',
									backgroundColor: Colors[theme].container_surface,
								}}
								titleStyle={{ fontSize: 14, fontWeight: '400' }}
								highlightWords={['#89']}
								title="Your #89 hardest trick"
							/>
						</View>
					</View>

					{/* spot and date info */}
					<View style={{ height: '25%' }}>
						<ThemedText theme={theme} value={spots[0].spot} />
						<ThemedText
							theme={theme}
							value={format(spots[0].landing_date, 'yyyy-MM-dd')}
						/>
					</View>
				</View>
			</View>
		</View>
	);
};

export default TrickPreviewCard;
