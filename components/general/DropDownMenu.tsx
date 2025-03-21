import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemIcon,
	DropdownMenuItemTitle,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from '../zeego/dropdown-menu';
import { dropDownMenuInputData } from '@/types';

interface DropDownMenuProps {
	items: Array<dropDownMenuInputData>;
	onSelect: (numb: number) => void;
	triggerComponent: React.ReactNode;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
	items,
	triggerComponent,
	onSelect,
}) => {
	return (
		<DropdownMenuRoot>
			<DropdownMenuTrigger>{triggerComponent}</DropdownMenuTrigger>

			<DropdownMenuContent>
				{items.map((val, key) => (
					<DropdownMenuItem onSelect={() => onSelect(key)} key={key.toString()}>
						<DropdownMenuItemTitle>{val.text}</DropdownMenuItemTitle>

						{(val.iconIOS || val.iconAndroid) && (
							<DropdownMenuItemIcon
								ios={{ name: val?.iconIOS as any, pointSize: 18 }}
								androidIconName={val?.iconAndroid}
							/>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenuRoot>
	);
};

const styles = StyleSheet.create({});

export default DropDownMenu;
