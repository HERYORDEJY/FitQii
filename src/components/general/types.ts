export type BottomSheetRef = {
  open: (payload?: any) => void;
  close: () => void;
  data: any;
  isVisible: boolean;
};
