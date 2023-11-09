import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';

@Component({
  selector: 'app-consulta-docente',
  templateUrl: './consulta-docente.component.html',
  styleUrls: ['./consulta-docente.component.css']
})
export class ConsultaDocenteComponent {


  //Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idDocente","nombre","dni","fecha","hora","estado","ubigeo"];

  //Para el ubigeo
  departamentos: string[] = [];;
  provincias: string[] = [];;
  distritos: Ubigeo[] = [];;
  
  //parametros de la consulta
  nombre:string  = "";
  dni:string  = "";
  estado:boolean  = true;
  selDepartamento:string = "-1";
  selProvincia:string = "-1";
  selDistrito:number = -1;

  constructor(private docenteService:DocenteService, 
              private  ubigeoService: UbigeoService){
      
      this.ubigeoService.listarDepartamento().subscribe(
              x =>  this.departamentos = x
      );

  }

  

  cargaProvincia(){
    this.ubigeoService.listaProvincias(this.selDepartamento).subscribe(
      response =>  this.provincias= response
    );
    this.distritos = [];
    this.selDistrito = -1;
    this.selProvincia = "-1";
 }

cargaDistrito(){
    this.ubigeoService.listaDistritos(this.selDepartamento, this.selProvincia).subscribe(
        response =>  this.distritos= response
    );
    this.selDistrito = -1;
}


  consulta(){

      console.log(">>> nombre >> " + this.nombre);
      console.log(">>> dni >> " + this.dni);
      console.log(">>> estado >> " + this.estado);
      console.log(">>> idUbigeo >> " + this.selDistrito);

      this.docenteService.consultaDinamica(this.nombre,this.dni,this.estado?1:0,this.selDistrito).subscribe(
          x => {
            this.dataSource = new MatTableDataSource<Docente>(x);
            this.dataSource.paginator = this.paginator; 
          }
      );
  }


}
