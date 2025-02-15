/** @odoo-module **/

import {ksGanttRenderer} from "@ks_gantt_view_base/js/ks_gantt_renderer_new";
import { patch } from "@web/core/utils/patch";
import { jsonrpc } from "@web/core/network/rpc_service";

patch(ksGanttRenderer.prototype,{
    ks_compute_task_drag(each_task) {
      if (this.ks_model_name == "hr.leave" && each_task.state == "validate") {
        return true;
      }
      return super.ks_compute_task_drag(each_task);
    },
    ks_task_drag_and_drop() {
      if (this.ks_model_name == "hr.leave") {
        gantt.config.order_branch = false;
        gantt.config.order_branch_free = false;
      } else {
        super.ks_task_drag_and_drop();
      }
    },
    willstart () {
      var ks_def;
      var ks_super = super.willstart();
      if (this.ks_model_name == "hr.leave") {
        ks_def = jsonrpc("web/dataset/call_kw",{
          model: "hr.leave.gantt.settings",
          method: "ks_get_gantt_view_settings",
          args: [],
          kwargs:{}
        }).then(
          function (result) {
            this.ks_enable_task_dynamic_text =
              result.ks_enable_task_dynamic_text;
            this.ks_enable_task_dynamic_progress = false;
            this.ks_enable_quickinfo_extension =
              result.ks_enable_quickinfo_extension;
            this.ks_project_tooltip_config = result.ks_project_tooltip_config
              ? result.ks_project_tooltip_config
              : false;
          }.bind(this)
        );
      }
      return Promise.all([ks_def, ks_super]);
    },


})


