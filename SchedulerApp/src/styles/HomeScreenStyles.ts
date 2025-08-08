import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// 스타일 타입 정의
type HomeScreenStylesType = {
  container: ViewStyle;
  calendarContainer: ViewStyle;
  scrollView: ViewStyle;
  scrollViewContent: ViewStyle;
  scheduleContainer: ViewStyle;
  viewModeContainer: ViewStyle;
  segmentedButtons: ViewStyle;
  dateRangeText: TextStyle;
  scheduleList: ViewStyle;
  scheduleItem: ViewStyle;
  scheduleContent: ViewStyle;
  scheduleRightContent: ViewStyle;
  scheduleMetaContainer: ViewStyle;
  priorityIndicator: ViewStyle;
  priorityText: TextStyle;
  scheduleTitleContainer: ViewStyle;
  titleAndPriorityContainer: ViewStyle;
  inlinePriorityContainer: ViewStyle;
  inlinePriorityText: TextStyle;
  categoryDot: ViewStyle;
  scheduleTitle: TextStyle;
  scheduleTime: TextStyle;
  completedScheduleItem: ViewStyle;
  completedScheduleTime: TextStyle;
  completedCategoryDot: ViewStyle;
  completedOverlay: ViewStyle;
  completeButton: ViewStyle;
  addButton: ViewStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
  emptySubText: TextStyle;
  debugContainer: ViewStyle;
  debugButton: ViewStyle;
  completedDialog: ViewStyle;
  completedDialogTitle: TextStyle;
  completedDialogIcon: ViewStyle;
  completedDialogContent: ViewStyle;
  completedScheduleTitle: TextStyle;
  completedDialogMessage: TextStyle;
  completedDialogActions: ViewStyle;
  completedDialogCancelButton: ViewStyle;
  completedDialogViewButton: ViewStyle;
  scheduleDetailDialog: ViewStyle;
  scheduleDetailTitleContainer: ViewStyle;
  detailTitleContainer: ViewStyle;
  detailCategoryDot: ViewStyle;
  detailTitleText: TextStyle;
  detailCompleteButton: ViewStyle;
  scheduleDetailContent: ViewStyle;
  detailScrollView: ViewStyle;
  detailChipsContainer: ViewStyle;
  detailCategoryChip: ViewStyle;
  detailCategoryChipText: TextStyle;
  detailCompletedChip: ViewStyle;
  detailCompletedChipText: TextStyle;
  detailPriorityChip: ViewStyle;
  detailPriorityChipText: TextStyle;
  detailTimeContainer: ViewStyle;
  detailTimeIcon: ViewStyle;
  detailTimeText: TextStyle;
  detailDescriptionContainer: ViewStyle;
  detailDescriptionLabel: TextStyle;
  detailDescriptionText: TextStyle;
  scheduleDetailActions: ViewStyle;
  detailCancelButton: ViewStyle;
  detailEditButton: ViewStyle;
  dialogActionsContainer: ViewStyle;
  dialogActionsContainerWithBorder: ViewStyle;
  dialogTitleContainer: ViewStyle;
  dialogTitleIcon: ViewStyle;
  dialogTitleText: TextStyle;
  scheduleDetailDialogContainer: ViewStyle;
  scheduleDetailHeader: ViewStyle;
  scheduleDetailHeaderContent: ViewStyle;
  scheduleDetailHeaderLeft: ViewStyle;
  scheduleDetailCategoryDot: ViewStyle;
  scheduleDetailTitle: TextStyle;
  scheduleDetailCompleteButton: ViewStyle;
  scheduleDetailBody: ViewStyle;
  scheduleDetailScrollView: ViewStyle;
  scheduleDetailChipsSection: ViewStyle;
  scheduleDetailChip: ViewStyle;
  scheduleDetailChipText: TextStyle;
  scheduleDetailTimeSection: ViewStyle;
  scheduleDetailTimeHeader: ViewStyle;
  scheduleDetailTimeIcon: ViewStyle;
  scheduleDetailTimeLabel: TextStyle;
  scheduleDetailTimeText: TextStyle;
  scheduleDetailDescriptionSection: ViewStyle;
  scheduleDetailDescriptionLabel: TextStyle;
  scheduleDetailDescriptionText: TextStyle;
  scheduleDetailFooter: ViewStyle;
  scheduleDetailButton: ViewStyle;
  scheduleDetailCancelButton: ViewStyle;
  scheduleDetailEditButton: ViewStyle;
  dialogBackground: ViewStyle;
  dialogBackgroundLight: ViewStyle;
  dialogBackgroundBlur: ViewStyle;
  dialogBackgroundClean: ViewStyle;
};

export const HomeScreenStyles = StyleSheet.create<HomeScreenStylesType>({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 60, // 네비게이션 바 높이 + 여유 공간 축소
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 12,
    marginTop: 6,
    marginBottom: 12, // FAB를 위한 여백 조정
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  viewModeContainer: {
    padding: 12,
    paddingBottom: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  segmentedButtons: {
    marginBottom: 6,
  },
  dateRangeText: {
    fontSize: 14,
    color: '#2C5282',
    textAlign: 'center',
    marginBottom: 6,
  },
  scheduleList: {
    padding: 12,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
  },
  scheduleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scheduleMetaContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  priorityIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scheduleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  titleAndPriorityContainer: {
    flex: 1,
  },
  inlinePriorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  inlinePriorityText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    flex: 1,
    lineHeight: 20,
  },
  scheduleTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'right',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  completedScheduleItem: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E2E8F0',
    borderLeftColor: '#94A3B8', // 완료된 일정은 회색 액센트 바
    position: 'relative',
  },
  completedScheduleTime: {
    color: '#94A3B8',
    backgroundColor: '#F1F5F9',
    textDecorationLine: 'line-through',
  },
  completedCategoryDot: {
    backgroundColor: '#94A3B8', // 완료된 일정은 회색으로 통일
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
  },
  completeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  addButton: {
    position: 'absolute',
    right: 12,
    bottom: 76,
    backgroundColor: '#2C5282',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  debugContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  debugButton: {
    flex: 1,
    height: 36,
  },
  // 완료된 일정 다이얼로그 스타일
  completedDialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
  },
  completedDialogTitle: {
    color: '#2C5282',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  completedDialogIcon: {
    marginRight: 8,
  },
  completedDialogContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  completedScheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5282',
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#81C784',
  },
  completedDialogMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
  },
  completedDialogActions: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  completedDialogCancelButton: {
    minWidth: 100,
    borderColor: '#E2E8F0',
  },
  completedDialogViewButton: {
    minWidth: 120,
  },
  // 상세 다이얼로그 스타일
  scheduleDetailDialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    maxHeight: '80%',
    elevation: 0,
  },
  scheduleDetailTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  detailTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailCategoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  detailTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C5282',
    flex: 1,
  },
  detailCompleteButton: {
    margin: 0,
  },
  scheduleDetailContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: 400,
  },
  detailScrollView: {
    flexGrow: 1,
  },
  detailChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  detailCategoryChip: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  detailCategoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailCompletedChip: {
    backgroundColor: '#81C784' + '20',
    borderColor: '#81C784',
    borderWidth: 1,
  },
  detailCompletedChipText: {
    color: '#81C784',
    fontWeight: '600',
    fontSize: 12,
  },
  detailPriorityChip: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  detailPriorityChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailTimeIcon: {
    marginRight: 8,
  },
  detailTimeText: {
    fontSize: 14,
    color: '#2C5282',
    fontWeight: '500',
    flex: 1,
  },
  detailDescriptionContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A5D8FF',
  },
  detailDescriptionLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailDescriptionText: {
    fontSize: 14,
    color: '#2C5282',
    lineHeight: 20,
  },
  scheduleDetailActions: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  detailCancelButton: {
    minWidth: 100,
    borderColor: '#E2E8F0',
  },
  detailEditButton: {
    minWidth: 100,
  },
  // 다이얼로그 액션 스타일
  dialogActionsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dialogActionsContainerWithBorder: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  // 다이얼로그 제목 스타일
  dialogTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogTitleIcon: {
    marginRight: 8,
  },
  dialogTitleText: {
    color: '#2C5282',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // 개선된 일정 상세 다이얼로그 스타일
  scheduleDetailDialogContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    maxHeight: '80%',
    // 그림자 제거
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleDetailHeader: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F0F9FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleDetailHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleDetailHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  scheduleDetailCategoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  scheduleDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    flex: 1,
    lineHeight: 24,
  },
  scheduleDetailCompleteButton: {
    margin: 0,
    backgroundColor: 'transparent',
  },
  scheduleDetailBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: 460,
  },
  scheduleDetailScrollView: {
    flexGrow: 1,
  },
  scheduleDetailChipsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  scheduleDetailChip: {
    borderWidth: 1,
    borderColor: '#EEF2F7',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleDetailChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scheduleDetailTimeSection: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2C5282',
  },
  scheduleDetailTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleDetailTimeIcon: {
    marginRight: 8,
  },
  scheduleDetailTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C5282',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scheduleDetailTimeText: {
    fontSize: 15,
    color: '#1A202C',
    fontWeight: '500',
    lineHeight: 20,
  },
  scheduleDetailDescriptionSection: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleDetailDescriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scheduleDetailDescriptionText: {
    fontSize: 15,
    color: '#1A202C',
    lineHeight: 22,
  },
  scheduleDetailFooter: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F0F9FF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scheduleDetailButton: {
    minWidth: 120,
    borderRadius: 8,
  },
  scheduleDetailCancelButton: {
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  scheduleDetailEditButton: {
    backgroundColor: '#2C5282',
  },
  // 다이얼로그 배경 스타일
  dialogBackground: {
    backgroundColor: 'rgba(240, 249, 255, 0.95)', // 앱 배경색과 일치하는 반투명
  },
  dialogBackgroundLight: {
    backgroundColor: 'rgba(240, 249, 255, 0.8)',
  },
  dialogBackgroundBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  dialogBackgroundClean: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
});
