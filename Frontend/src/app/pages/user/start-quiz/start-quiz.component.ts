import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../services/question.service';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@Component({
    selector: 'app-start-quiz',
    standalone: true,
    templateUrl: './start-quiz.component.html',
    styleUrl: './start-quiz.component.css',
    imports: [NavbarComponent,MatCardModule,MatListModule,MatIconModule,MatButtonModule,
    CommonModule,MatFormFieldModule,FormsModule,MatInputModule,MatRadioModule,
RouterLink,MatProgressSpinnerModule]
})
export class StartQuizComponent implements OnInit {

    constructor(private locationStatergy:LocationStrategy,private route:ActivatedRoute,
        private questionService:QuestionService){}

    qid:any;
    questions=[
        {
          qid:'',
          content:'',
          option1:'',
          option2:'',
          option3:'',
          option4:'',
          answer:'',
          givenAnswer:'',
          quiz:{
            qid:'',
            title:'',
            maxMarks:''
          }
    
        }
      ];

      marksGot=0;
      correctAnswers=0;
      attempted=0;
      isSubmit=false;
      timer:any;

    ngOnInit(): void {
        this.preventBackButton();
        this.qid=this.route.snapshot.params['qid'];
        this.loadQuestions();
    }
    loadQuestions() {
        this.questionService.getQuestionsOfQuizForUser(this.qid).subscribe((data:any)=>{
            this.questions=data;
            this.timer=this.questions.length*2*60;
           this.questions.forEach((q)=>{
                console.log(this.questions);
                q['givenAnswer']='';
           })
           this.startTimer();
        },
        (error)=>{
            console.log(error);
        }
        )
    }

    preventBackButton(){
        history.pushState(null,'null',location.href);
        this.locationStatergy.onPopState(()=>{
            history.pushState(null,'null',location.href);
        })
    }

    submitQuiz(){
        Swal.fire({
            title:'Do You Want To Submit The Quiz',
            showCancelButton:true,
            denyButtonText:'Cancel',
            confirmButtonText:'Submit',
            icon:'info'
        }).then((result)=>{
            if(result.isConfirmed){
               this.evalQuiz();
            }
        })
        
    }

    public startTimer(){
       let t= window.setInterval(()=>{
            if(this.timer<=0){
                this.evalQuiz();
                clearInterval(t);
            }
            else{
                this.timer--;
            }
        },1000)
    }

    public getFormattedTime(){
        let mm=Math.floor(this.timer/60);
        let ss=this.timer-mm*60;
        return `${mm} min : ${ss} sec`; 
    }

    public evalQuiz(){
        this.marksGot=0;
        this.correctAnswers=0;
        this.attempted=0;
        this.isSubmit=true;
        this.questions.forEach((q)=>{
            if(q.givenAnswer==q.answer){
                this.correctAnswers++;
                this.marksGot++;

            }
            if(q.givenAnswer.trim()!=''){
                this.attempted++;
            }
            
        })
        console.log("correct answers"+this.correctAnswers);
            console.log("Marks obtained:"+this.marksGot);
            console.log("Attempted Questions: "+this.attempted);
            console.log(this.questions);
           
    }



}
