import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/Company';
import { Employee } from 'src/app/models/Employee';
import { Particular } from 'src/app/models/Particular';
import { CompanyService } from 'src/app/services/company.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ParticularService } from 'src/app/services/particular.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insert-client',
  templateUrl: './insert-client.component.html',
  styleUrls: ['./insert-client.component.scss']
})
export class InsertClientComponent implements OnInit{

  constructor(
    private particularService: ParticularService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}


  companies: Company[] = [];
 
  entreprise: Partial<Company> = {};
  particulier!: string;
  employe!: string;
  userForm!: FormGroup;
  formVisibility!: string;
  isLoading!: boolean;
  idParticipant!: any;
  isFormEdit!: boolean;
  curentUri!: string;

  employeeValue!: Employee;

  ngOnInit(): void {
    this.idParticipant = this.route.snapshot.paramMap.get('id');
    if(this.idParticipant) {
      this.formVisibility = this.route.snapshot.url[1]?.path ||'';
      this.getById(this.idParticipant);
      
      this.isFormEdit = true;
    }
    this.initForm();
    this.getAllCompany();
  }

  getById(id: any) {
    switch (this.formVisibility) {
      case 'employe':
        this.employeeService.getById(id).subscribe({
          next: data => {
            this.userForm.patchValue(data);
            this.entreprise = data.company;
          }
        });
        break;
      case 'company':
        this.companyService.getById(id).subscribe({
          next: data => {
            this.userForm.patchValue(data);
          }
        });
        break;
        case 'particulier':
        this.particularService.getById(id).subscribe({
          next: data => {
            this.userForm.patchValue(data);
          }
        });
        break;
      default:
        break;
    }
  }

  getAllCompany() {
    this.companyService.getAll().subscribe(
      data => {
        this.companies = data;
        
      }
    )
  }

  initForm() {
      // Sélectionnez la première entreprise du tableau 'companies' comme entreprise par défaut
      this.userForm = new FormGroup({
        id: new FormControl(),
        company: new FormControl(), 
        firstname: new FormControl(''),
        email: new FormControl('', [Validators.required, Validators.email]),
        lastname: new FormControl(''),
        name: new FormControl(''),
        phone: new FormControl(''),
        activity: new FormControl(''),
        gender: new FormControl('M'),
        highestDiploma: new FormControl(''),
        address: new FormControl(''),
        birthDate: new FormControl('')
      });
  }

  updateForm(event: any) {
    this.formVisibility = event.target.value;
  }

  createParticipant() {
    this.isLoading = true;
    let form = this.userForm.value;
    if(this.idParticipant) {
      if(this.formVisibility == 'employe') {        
        this.employeeService.edit(this.idParticipant, form).subscribe(
          data => {
            this.isLoading = false;
            Swal.fire(
              'Modifié!',
              "L'employé a été modifié avec succès.",
              'success'
            );
            this.router.navigate(['/clients']);
          }
        )
      } else if(this.formVisibility == "company") {
        this.companyService.edit(this.idParticipant, form).subscribe(
          data => {
            this.isLoading = false;
            Swal.fire(
              'Modifié!',
              "L'entreprise a été modifié avec succès.",
              'success'
            );
            this.router.navigate(['/clients']);
          }
        )
      } else {
          this.particularService.edit(this.idParticipant, form).subscribe(
            data => {
              this.isLoading = false;
              Swal.fire(
                'Ajouté!',
                "Le participant a été modifié avec succès.",
                'success'
              );
              this.router.navigate(['/clients'])
            }
          )
      }
    } else {
      if(this.formVisibility == 'employe') {
        this.employeeService.save(form).subscribe(
          data => {
            this.isLoading = false;
            Swal.fire(
              'Ajouté!',
              "L'employé a été ajouté avec succès.",
              'success'
            );
            
            this.router.navigate(['/clients']);
          }
        )
      } else if(this.formVisibility == 'particulier') {
        this.particularService.save(form).subscribe(
            data => {
              this.isLoading = false;
              Swal.fire(
                'Ajouté!',
                "Le participant a été ajouté avec succès.",
                'success'
              );
              this.router.navigate(['/clients']);
            }
          )
      } else {
        this.companyService.save(form).subscribe(
          data => {
            this.isLoading = false;
              Swal.fire(
                'Ajouté!',
                "L'entreprise a été ajouté avec succès.",
                'success'
              );
              this.router.navigate(['/clients']);
          }
        )
      }

    }
  }


  // employeeFormValue() {
  //   this.employeeValue = this.userForm.value;
  //   this.employeeValue.firstname = this.userForm.value.firstname;
  //   this.employeeValue.lastname = this.userForm.value.lastname;
  //   this.employeeValue.company = this.userForm.value.company;
  //   this.employeeValue.gender = this.userForm.value.gender;

  //   return this.employeeValue;
  // }

}