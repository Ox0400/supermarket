import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'
import {Form,Input,Table,Button,Select,Pagination,MessageBox,Message} from 'element-react';
import SpinnerComponent from '../spinner/SpinnerComponent'
import './Products.scss'
import * as ProductsAction from './ProductsAction'
import EditProductsComponent from './EditProdutsComponent'
import $ from '../../libs/jquery-3.2.1.min.js'


class ProductsComponent extends React.Component{
	constructor(props) {
  		super(props);

		this.state = {
		    columns: [
		      {
		        label: "货号",
		        prop: "goodsId",
		        width: 80,
		      },
		      {
		        label: "条码",
		        prop: "barCode",
		        width: 160
		      },
		      {
		        label: "商品名称",
		        prop: "goodsName",
		        width: 160
		      },
		      {
		        label: "规格",
		        prop: "specification",
		        width: 80
		      },
		      {
		        label: "类别",
		        prop: "classify",
		        width: 70
		      },
		      {
		        label: "单位",
		        prop: "unit",
		        width: 70
		      },
		      {
		        label: "进货价",
		        prop: "purchasingCost",
		        width: 80
		      },
		      {
		        label: "销售价",
		        prop: "salePrice",
		        width: 80
		      },
		      {
		        label: "创建时间",
		        prop: "CreateTime",
		        width: 120
		      },
		      {
		        label: "更新时间",
		        prop: "ModifiTime",
		        width: 120
		      },
		      {
		        label: "供应商Id",
		        prop: "supplierId",
		        width: 100
		      },
		      {
		        label: "操作",
		        prop: "zip",
		        width: 100,
		        render: ()=>{
		          return <div>
		          <span className = "edit"><i className="el-icon-edit icon"></i></span>
                  <span className = "delete"><i className="el-icon-delete icon"></i></span></div>
		        }
		      }
		    ]
		   
		   
		}
	}

	//组件挂载前触发
	componentWillMount(){
		this.props.products({qty:10}).then(function(res){
			console.log(res)
		});
		
	}

	//组件挂载后触发
	componentDidMount() { 
		var _this = this.props;
        var _state = this;
		$('table').on('click','.delete',function() {
			var qty = _state.refs.pageNo.state.internalPageSize;
			var current = _state.refs.pageNo.state.internalCurrentPage;
			MessageBox.confirm('是否要删除此商品?', '提示', {
                type: 'warning'
            }).then(() => {
                //删除前端数据；
                $(_state).parents("tr").remove();
                //获取当前删除用户的信息，更新数据库；
                var currentId = $(this).parents("tr").children().eq(0).text();
                _this.removeProduct(current,qty,currentId).then(function(res){
                	console.log('res',res)
                    if(res.response.status){
                        //弹框提示；
                        Message({
                          type: 'success',
                          message: '删除成功!'
                        })
                    }
                })
            }).catch(() => {
                Message({type: 'info',message: '已取消删除'});
            });
		}).on('click','.edit',function() {
			let index = $(this).closest('tr').index();
			_state.edit(index)
		})
	}

	edit(idx) {
		let data = this.props.data[idx];
		console.log(data)
        //要修改商品的条码
        let editgoodsId = data.goodsId;
        this.props.editBox({type: 'open',status: true, editData: data})
	}

	//改变多少条数据/页
	onChange() {
		var val = parseInt(document.querySelector('.pageNum .el-input__inner').value); 
  		this.props.products({qty:val}).then(function(res){
		});
	}
	
	//改变页码
	CurrentChange(){
		var val = parseInt(document.querySelector('.pageNum .el-input__inner').value); 
		var current = document.querySelector('.pageNum li.active').innerText;
		this.props.products({page:current,qty:val}).then(res=>{
		});
	}

	render() {
	  return (
	  	<div>
	    <Table
	      style={{width: '100%'}}
	      columns={this.state.columns}
	      data={this.props.data}
	      border={true}
	      height={532}
	    />
	    <SpinnerComponent show={this.props.loading}/>
	    <div className="block">
        	<span className="demonstration"></span>
        	<Pagination 
        	ref = "pageNo"
        	className="pageNum" 
        	onSizeChange={this.onChange.bind(this)} 
        	layout="total, sizes, prev, pager, next, jumper" 
        	total={this.props.total} 
        	pageSizes={[10, 15, 20, 50,100]} 
        	pageSize={10} 
        	currentPage={this.props.pageNo} 
        	onCurrentChange={this.CurrentChange.bind(this)} 
        	/>
      	</div>
      	<EditProductsComponent alldata={this.props.data}/>
	    </div>
	  )
	}    

}

const mapStateToProps = state => {
    return {
    	loading: state.products.loading,
    	data: state.products.data,
    	pageNo: state.products.pageNo,
    	total:state.products.total,
    	qty:state.products.qty


    }
}

export default connect(mapStateToProps, ProductsAction)(ProductsComponent)