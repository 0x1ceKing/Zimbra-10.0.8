<%@ page import="com.zimbra.cs.taglib.bean.BeanUtils" %>
<%
String contextPath = request.getContextPath();
if (contextPath.equals("/")) contextPath = "";
String vers = (String) request.getAttribute("version");
vers = BeanUtils.cook(vers);
String ext = (String) request.getAttribute("fileExtension");
ext = BeanUtils.cook(ext);
%>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaUtil.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaEvent.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaModel.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaId.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaIPUtil.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/Lifetime_XFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/config/settings/ZaSettings.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaAppCtxt.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaAuthenticate.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaPopupMenu.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaAppViewMgr.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaLoginDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaXFormViewController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaListViewController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaItemVector.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaItemList.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaToolBar.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaToolBarLabel.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaToolBarButton.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaOverviewPanel.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaClientCmdHandler.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaApp.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaAboutDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaMsgDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaErrorDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaTabView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaXWizardDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/LDAPURL_XFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/HostPort_XFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/MailQuota_XModelItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaSelectRadioXFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaZimletSelectXFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaCheckBoxListXFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/Signature_XFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/Super_XFormItems.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaSplashScreen.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaCurrentAppToolBar.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaCrtAppTreeHeader.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaServerVersionInfo.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/MenuButton_XFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaAutoCompleteListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/AutoComplete_XFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaKeyMap.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ACLXFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaSkinPoolChooser.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaZimletPoolChooser.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaXProgressDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaAppTabGroup.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaAppTab.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaRequestMgr.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaActionStatusView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaTreeItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaTree.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaCurrentAppBar.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaHistoryMgr.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaUploader.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaOverviewPanelController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/ZaOperation.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/home/controller/ZaHomeController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/controller/ZaAccountListController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/controller/ZaAccountViewController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/cos/controller/ZaCosListController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/cos/controller/ZaCosController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/controller/ZaDomainListController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/controller/ZaServerListController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/controller/ZaServerController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/adminext/controller/ZaAdminExtListController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/zimlets/controller/ZaZimletListController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/zimlets/controller/ZaZimletViewController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/controller/ZaDomainController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/status/controller/ZaStatusViewController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/controller/ZaGlobalStatsController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/controller/ZaServerStatsController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/globalconfig/controller/ZaGlobalConfigViewController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/dl/controller/ZaDLController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/resource/controller/ZaResourceController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/helpdesk/controller/ZaHelpViewController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/helpdesk/controller/ZaMWizController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/mta/controller/ZaMTAListController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/mta/controller/ZaMTAController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/controller/ZaSearchListController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/controller/ZaSearchBuilderController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/task/controller/ZaTaskController.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/home/model/ZaHome.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/model/ZaDataSource.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/model/ZaAccount.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/dl/model/ZaDistributionList.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/resource/model/ZaSignature.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/resource/model/ZaResource.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/resource/model/ZaContactList.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/model/ZaAlias.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/model/ZaForwardingAddress.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/model/ZaFp.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/cos/model/ZaCos.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/model/ZaDomain.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/model/ZaSearch.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/model/ZaSearchOption.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/model/ZaServer.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/zimlets/model/ZaZimlet.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/rp/model/ZaRetentionPolicy.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/globalconfig/model/ZaGlobalConfig.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/status/model/ZaStatus.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/mta/model/ZaMTA.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/task/model/ZaTask.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/home/view/ZaHomeXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaAccountXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaAccChangePwdXDlg.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaEditAliasXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaEditFwdAddrXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaEditFpXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaAccountListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaNewAccountXWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/MoveAliasXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ReindexMailboxXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/DeleteAcctsPgrsDlg.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/view/ZaServerVolumesListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/view/ZaEditVolumeXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/view/ZaProxyPortWarningXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/view/ZaServerListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/view/ZaServerMiniListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/view/ZaFlushCacheXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/servers/view/ZaServerXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/adminext/view/ZaAdminExtListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/zimlets/view/ZaZimletListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/zimlets/view/ZaZimletXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/zimlets/view/ZaZimletDeployXWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaDomainListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaDomainXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaNewDomainXWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaDomainAliasWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaGALConfigXWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaAuthConfigXWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaTaskAuthConfigWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaTaskAutoProvDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaManualProvConfigDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/AddrACL_XFormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaEditDomainAclXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaAddDomainAclXDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaGalObjMiniListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/domains/view/ZaDomainAccountQuotaListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/cos/view/ZaCosListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/cos/view/ZaCosXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/cos/view/ZaNewCosXWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/view/ZaSearchToolBar.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/view/ZaSearchField.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/view/ZaSearchListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/view/ZaSearchBuilderToolbarView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/view/ZaSearchOptionView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/view/ZaSearchBuilderView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/view/ZaSearchOptionDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/search/view/ZaSearchBubbleList.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/status/view/ZaServicesListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaGlobalStatsView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaGlobalMessageVolumePage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaGlobalMessageCountPage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaGlobalSpamActivityPage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaGlobalAdvancedStatsPage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaServerStatsView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaServerMessageVolumePage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaServerMessageCountPage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaServerSpamActivityPage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaServerDiskStatsPage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaServerMBXStatsPage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/statistics/view/ZaServerSessionStatsPage.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/rp/view/ZaRetentionPolicyListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/rp/view/ZaRetentionPolicyDlg.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/globalconfig/view/GlobalConfigXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaAccMiniListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/dl/view/ZaDLXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/dl/view/ZaNewDLXWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/resource/view/ZaResourceXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/resource/view/ZaNewResourceXWizard.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/resource/view/ZaSignatureDlg.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/ZaZimbraAdmin.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/helpdesk/view/ZaHelpView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/helpdesk/view/ZaMWizView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/mta/view/ZaQSummaryListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/mta/view/ZaQMessagesListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/mta/view/ZaMTAListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/mta/view/ZaMTAXFormView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/mta/view/ZaMTAActionDialog.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/accounts/view/ZaAccountMemberOfListView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/task/view/ZaTaskHeaderPanel.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/task/view/ZaTaskContentView.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/zimbraAdmin/common/EmailAddr_FormItem.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/templates/admin/Widgets.template.js?v=<%=vers%>"></script>
<script type="text/javascript">
AjxPackage.define("Admin");
AjxPackage.define("zimbraAdmin.common.ZaUtil");
AjxPackage.define("zimbraAdmin.common.ZaEvent");
AjxPackage.define("zimbraAdmin.common.ZaModel");
AjxPackage.define("zimbraAdmin.common.ZaItem");
AjxPackage.define("zimbraAdmin.common.ZaId");
AjxPackage.define("zimbraAdmin.common.ZaIPUtil");
AjxPackage.define("zimbraAdmin.common.Lifetime_XFormItem");
AjxPackage.define("zimbraAdmin.config.settings.ZaSettings");
AjxPackage.define("zimbraAdmin.common.ZaAppCtxt");
AjxPackage.define("zimbraAdmin.common.ZaAuthenticate");
AjxPackage.define("zimbraAdmin.common.ZaPopupMenu");
AjxPackage.define("zimbraAdmin.common.ZaAppViewMgr");
AjxPackage.define("zimbraAdmin.common.ZaLoginDialog");
AjxPackage.define("zimbraAdmin.common.ZaController");
AjxPackage.define("zimbraAdmin.common.ZaXFormViewController");
AjxPackage.define("zimbraAdmin.common.ZaListViewController");
AjxPackage.define("zimbraAdmin.common.ZaItemVector");
AjxPackage.define("zimbraAdmin.common.ZaItemList");
AjxPackage.define("zimbraAdmin.common.ZaListView");
AjxPackage.define("zimbraAdmin.common.ZaToolBar");
AjxPackage.define("zimbraAdmin.common.ZaToolBarLabel");
AjxPackage.define("zimbraAdmin.common.ZaToolBarButton");
AjxPackage.define("zimbraAdmin.common.ZaOverviewPanel");
AjxPackage.define("zimbraAdmin.common.ZaClientCmdHandler");
AjxPackage.define("zimbraAdmin.common.ZaApp");
AjxPackage.define("zimbraAdmin.common.ZaAboutDialog");
AjxPackage.define("zimbraAdmin.common.ZaMsgDialog");
AjxPackage.define("zimbraAdmin.common.ZaErrorDialog");
AjxPackage.define("zimbraAdmin.common.ZaTabView");
AjxPackage.define("zimbraAdmin.common.ZaXDialog");
AjxPackage.define("zimbraAdmin.common.ZaXWizardDialog");
AjxPackage.define("zimbraAdmin.common.LDAPURL_XFormItem");
AjxPackage.define("zimbraAdmin.common.HostPort_XFormItem");
AjxPackage.define("zimbraAdmin.common.MailQuota_XModelItem");
AjxPackage.define("zimbraAdmin.common.ZaSelectRadioXFormItem");
AjxPackage.define("zimbraAdmin.common.ZaZimletSelectXFormItem");
AjxPackage.define("zimbraAdmin.common.ZaCheckBoxListXFormItem");
AjxPackage.define("zimbraAdmin.common.Signature_XFormItem");
AjxPackage.define("zimbraAdmin.common.Super_XFormItems");
AjxPackage.define("zimbraAdmin.common.ZaSplashScreen");
AjxPackage.define("zimbraAdmin.common.ZaCurrentAppToolBar");
AjxPackage.define("zimbraAdmin.common.ZaCrtAppTreeHeader");
AjxPackage.define("zimbraAdmin.common.ZaServerVersionInfo");
AjxPackage.define("zimbraAdmin.common.MenuButton_XFormItem");
AjxPackage.define("zimbraAdmin.common.ZaAutoCompleteListView");
AjxPackage.define("zimbraAdmin.common.AutoComplete_XFormItem");
AjxPackage.define("zimbraAdmin.common.ZaKeyMap");
AjxPackage.define("zimbraAdmin.common.ACLXFormItem");
AjxPackage.define("zimbraAdmin.common.ZaSkinPoolChooser");
AjxPackage.define("zimbraAdmin.common.ZaZimletPoolChooser");
AjxPackage.define("zimbraAdmin.common.ZaXProgressDialog");
AjxPackage.define("zimbraAdmin.common.ZaAppTabGroup");
AjxPackage.define("zimbraAdmin.common.ZaAppTab");
AjxPackage.define("zimbraAdmin.common.ZaRequestMgr");
AjxPackage.define("zimbraAdmin.common.ZaActionStatusView");
AjxPackage.define("zimbraAdmin.common.ZaTreeItem");
AjxPackage.define("zimbraAdmin.common.ZaTree");
AjxPackage.define("zimbraAdmin.common.ZaCurrentAppBar");
AjxPackage.define("zimbraAdmin.common.ZaHistoryMgr");
AjxPackage.define("zimbraAdmin.common.ZaUploader");
AjxPackage.define("zimbraAdmin.common.ZaOverviewPanelController");
AjxPackage.define("zimbraAdmin.common.ZaOperation");
AjxPackage.define("zimbraAdmin.home.controller.ZaHomeController");
AjxPackage.define("zimbraAdmin.accounts.controller.ZaAccountListController");
AjxPackage.define("zimbraAdmin.accounts.controller.ZaAccountViewController");
AjxPackage.define("zimbraAdmin.cos.controller.ZaCosListController");
AjxPackage.define("zimbraAdmin.cos.controller.ZaCosController");
AjxPackage.define("zimbraAdmin.domains.controller.ZaDomainListController");
AjxPackage.define("zimbraAdmin.servers.controller.ZaServerListController");
AjxPackage.define("zimbraAdmin.servers.controller.ZaServerController");
AjxPackage.define("zimbraAdmin.adminext.controller.ZaAdminExtListController");
AjxPackage.define("zimbraAdmin.zimlets.controller.ZaZimletListController");
AjxPackage.define("zimbraAdmin.zimlets.controller.ZaZimletViewController");
AjxPackage.define("zimbraAdmin.domains.controller.ZaDomainController");
AjxPackage.define("zimbraAdmin.status.controller.ZaStatusViewController");
AjxPackage.define("zimbraAdmin.statistics.controller.ZaGlobalStatsController");
AjxPackage.define("zimbraAdmin.statistics.controller.ZaServerStatsController");
AjxPackage.define("zimbraAdmin.globalconfig.controller.ZaGlobalConfigViewController");
AjxPackage.define("zimbraAdmin.dl.controller.ZaDLController");
AjxPackage.define("zimbraAdmin.resource.controller.ZaResourceController");
AjxPackage.define("zimbraAdmin.helpdesk.controller.ZaHelpViewController");
AjxPackage.define("zimbraAdmin.helpdesk.controller.ZaMWizController");
AjxPackage.define("zimbraAdmin.mta.controller.ZaMTAListController");
AjxPackage.define("zimbraAdmin.mta.controller.ZaMTAController");
AjxPackage.define("zimbraAdmin.search.controller.ZaSearchListController");
AjxPackage.define("zimbraAdmin.search.controller.ZaSearchBuilderController");
AjxPackage.define("zimbraAdmin.task.controller.ZaTaskController");
AjxPackage.define("zimbraAdmin.home.model.ZaHome");
AjxPackage.define("zimbraAdmin.accounts.model.ZaDataSource");
AjxPackage.define("zimbraAdmin.accounts.model.ZaAccount");
AjxPackage.define("zimbraAdmin.dl.model.ZaDistributionList");
AjxPackage.define("zimbraAdmin.resource.model.ZaSignature");
AjxPackage.define("zimbraAdmin.resource.model.ZaResource");
AjxPackage.define("zimbraAdmin.resource.model.ZaContactList");
AjxPackage.define("zimbraAdmin.accounts.model.ZaAlias");
AjxPackage.define("zimbraAdmin.accounts.model.ZaForwardingAddress");
AjxPackage.define("zimbraAdmin.accounts.model.ZaFp");
AjxPackage.define("zimbraAdmin.cos.model.ZaCos");
AjxPackage.define("zimbraAdmin.domains.model.ZaDomain");
AjxPackage.define("zimbraAdmin.search.model.ZaSearch");
AjxPackage.define("zimbraAdmin.search.model.ZaSearchOption");
AjxPackage.define("zimbraAdmin.servers.model.ZaServer");
AjxPackage.define("zimbraAdmin.zimlets.model.ZaZimlet");
AjxPackage.define("zimbraAdmin.rp.model.ZaRetentionPolicy");
AjxPackage.define("zimbraAdmin.globalconfig.model.ZaGlobalConfig");
AjxPackage.define("zimbraAdmin.status.model.ZaStatus");
AjxPackage.define("zimbraAdmin.mta.model.ZaMTA");
AjxPackage.define("zimbraAdmin.task.model.ZaTask");
AjxPackage.define("zimbraAdmin.home.view.ZaHomeXFormView");
AjxPackage.define("zimbraAdmin.accounts.view.ZaAccountXFormView");
AjxPackage.define("zimbraAdmin.accounts.view.ZaAccChangePwdXDlg");
AjxPackage.define("zimbraAdmin.accounts.view.ZaEditAliasXDialog");
AjxPackage.define("zimbraAdmin.accounts.view.ZaEditFwdAddrXDialog");
AjxPackage.define("zimbraAdmin.accounts.view.ZaEditFpXDialog");
AjxPackage.define("zimbraAdmin.accounts.view.ZaAccountListView");
AjxPackage.define("zimbraAdmin.accounts.view.ZaNewAccountXWizard");
AjxPackage.define("zimbraAdmin.accounts.view.MoveAliasXDialog");
AjxPackage.define("zimbraAdmin.accounts.view.ReindexMailboxXDialog");
AjxPackage.define("zimbraAdmin.accounts.view.DeleteAcctsPgrsDlg");
AjxPackage.define("zimbraAdmin.servers.view.ZaServerVolumesListView");
AjxPackage.define("zimbraAdmin.servers.view.ZaEditVolumeXDialog");
AjxPackage.define("zimbraAdmin.servers.view.ZaProxyPortWarningXDialog");
AjxPackage.define("zimbraAdmin.servers.view.ZaServerListView");
AjxPackage.define("zimbraAdmin.servers.view.ZaServerMiniListView");
AjxPackage.define("zimbraAdmin.servers.view.ZaFlushCacheXDialog");
AjxPackage.define("zimbraAdmin.servers.view.ZaServerXFormView");
AjxPackage.define("zimbraAdmin.adminext.view.ZaAdminExtListView");
AjxPackage.define("zimbraAdmin.zimlets.view.ZaZimletListView");
AjxPackage.define("zimbraAdmin.zimlets.view.ZaZimletXFormView");
AjxPackage.define("zimbraAdmin.zimlets.view.ZaZimletDeployXWizard");
AjxPackage.define("zimbraAdmin.domains.view.ZaDomainListView");
AjxPackage.define("zimbraAdmin.domains.view.ZaDomainXFormView");
AjxPackage.define("zimbraAdmin.domains.view.ZaNewDomainXWizard");
AjxPackage.define("zimbraAdmin.domains.view.ZaDomainAliasWizard");
AjxPackage.define("zimbraAdmin.domains.view.ZaGALConfigXWizard");
AjxPackage.define("zimbraAdmin.domains.view.ZaAuthConfigXWizard");
AjxPackage.define("zimbraAdmin.domains.view.ZaTaskAuthConfigWizard");
AjxPackage.define("zimbraAdmin.domains.view.ZaTaskAutoProvDialog");
AjxPackage.define("zimbraAdmin.domains.view.ZaManualProvConfigDialog");
AjxPackage.define("zimbraAdmin.domains.view.AddrACL_XFormItem");
AjxPackage.define("zimbraAdmin.domains.view.ZaEditDomainAclXDialog");
AjxPackage.define("zimbraAdmin.domains.view.ZaAddDomainAclXDialog");
AjxPackage.define("zimbraAdmin.domains.view.ZaGalObjMiniListView");
AjxPackage.define("zimbraAdmin.domains.view.ZaDomainAccountQuotaListView");
AjxPackage.define("zimbraAdmin.cos.view.ZaCosListView");
AjxPackage.define("zimbraAdmin.cos.view.ZaCosXFormView");
AjxPackage.define("zimbraAdmin.cos.view.ZaNewCosXWizard");
AjxPackage.define("zimbraAdmin.search.view.ZaSearchToolBar");
AjxPackage.define("zimbraAdmin.search.view.ZaSearchField");
AjxPackage.define("zimbraAdmin.search.view.ZaSearchListView");
AjxPackage.define("zimbraAdmin.search.view.ZaSearchBuilderToolbarView");
AjxPackage.define("zimbraAdmin.search.view.ZaSearchOptionView");
AjxPackage.define("zimbraAdmin.search.view.ZaSearchBuilderView");
AjxPackage.define("zimbraAdmin.search.view.ZaSearchOptionDialog");
AjxPackage.define("zimbraAdmin.search.view.ZaSearchBubbleList");
AjxPackage.define("zimbraAdmin.status.view.ZaServicesListView");
AjxPackage.define("zimbraAdmin.statistics.view.ZaGlobalStatsView");
AjxPackage.define("zimbraAdmin.statistics.view.ZaGlobalMessageVolumePage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaGlobalMessageCountPage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaGlobalSpamActivityPage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaGlobalAdvancedStatsPage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaServerStatsView");
AjxPackage.define("zimbraAdmin.statistics.view.ZaServerMessageVolumePage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaServerMessageCountPage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaServerSpamActivityPage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaServerDiskStatsPage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaServerMBXStatsPage");
AjxPackage.define("zimbraAdmin.statistics.view.ZaServerSessionStatsPage");
AjxPackage.define("zimbraAdmin.rp.view.ZaRetentionPolicyListView");
AjxPackage.define("zimbraAdmin.rp.view.ZaRetentionPolicyDlg");
AjxPackage.define("zimbraAdmin.globalconfig.view.GlobalConfigXFormView");
AjxPackage.define("zimbraAdmin.accounts.view.ZaAccMiniListView");
AjxPackage.define("zimbraAdmin.dl.view.ZaDLXFormView");
AjxPackage.define("zimbraAdmin.dl.view.ZaNewDLXWizard");
AjxPackage.define("zimbraAdmin.resource.view.ZaResourceXFormView");
AjxPackage.define("zimbraAdmin.resource.view.ZaNewResourceXWizard");
AjxPackage.define("zimbraAdmin.resource.view.ZaSignatureDlg");
AjxPackage.define("zimbraAdmin.ZaZimbraAdmin");
AjxPackage.define("zimbraAdmin.helpdesk.view.ZaHelpView");
AjxPackage.define("zimbraAdmin.helpdesk.view.ZaMWizView");
AjxPackage.define("zimbraAdmin.mta.view.ZaQSummaryListView");
AjxPackage.define("zimbraAdmin.mta.view.ZaQMessagesListView");
AjxPackage.define("zimbraAdmin.mta.view.ZaMTAListView");
AjxPackage.define("zimbraAdmin.mta.view.ZaMTAXFormView");
AjxPackage.define("zimbraAdmin.mta.view.ZaMTAActionDialog");
AjxPackage.define("zimbraAdmin.accounts.view.ZaAccountMemberOfListView");
AjxPackage.define("zimbraAdmin.task.view.ZaTaskHeaderPanel");
AjxPackage.define("zimbraAdmin.task.view.ZaTaskContentView");
AjxPackage.define("zimbraAdmin.common.EmailAddr_FormItem");
AjxPackage.define("admin.Widgets");
</script>
