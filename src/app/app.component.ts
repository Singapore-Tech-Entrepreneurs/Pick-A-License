import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from './app.component.question';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private jsonData: any;
  private question: any;
  private questionire: any;
  private answer: any = 'yes';
  public state = 'beginning';
  public hint: any;
  public license: any;
  public answeredQuestions = [];
  public sidebarActive = false;
  public showOwnersFAQ = true;
  public showUsersFAQ = true;
  public faq_owners = [];
  public faq_users = [];

  /* Constructor load the questions http request and question response */
  constructor(private http: HttpClient) {
    http.get('../app/questionire.json').subscribe((res1: any) => {
      this.questionire = res1;
      http.get('../app/decision-tree.json').subscribe((res2: any) => {
        this.jsonData = res2;
        this.question = new Question(this);
        this.question.setData(res2);
        this.hint = this.question.yes_hint;
      });
    });
    http.get('../app/faq_users.json').subscribe((res: any) => {
      this.faq_users = res.faq;
    });
    http.get('../app/faq_owners.json').subscribe((res: any) => {
      this.faq_owners = res.faq;
    });
  }

  /* Set Answers for the question till the end */
  setAnswer() {
    this.answeredQuestions.push(this.question);
    this.question = this.question.getNext();
    if (typeof this.question === 'string') {
      this.setState('end');
    }
  }

  /* get the state like which route you have */
  setState(state: any) {
    this.state = state;
  }

  /* get license for download txt file*/
  getLicense() {
    const licenses = {
      'GPL v3': '../licenses/gnu-gplv3.txt',
      'MIT': '../licenses/MIT.txt',
      'BSD 3-clause': '../licenses/bsd-3-clause.txt',
      'Apache 2.0': '../licenses/apache-2-0.txt',
      'MPL 2.0': '../licenses/mpl-2.txt',
      'LGPL v3': '../licenses/lgpl-3.txt',
      'LGPL v2.1': '../licenses/lgpl-2-1.txt',
      'Affero GPL': '../licenses/affero-gpl.txt',
      'Ms-RL': '../licenses/ms-rl.txt',
      'EPL 1.0': '../licenses/epl-1-0.txt',
      'CDDL 1.0': '../licenses/cddl-1-0.txt',
      'zlib/png license': '../licenses/zlib-png.txt',
      'BSD 2-clause': '../licenses/bsd-2-clause.txt',
      'WTFPL': '../licenses/wtfpl.txt',
      'Artistic license': '../licenses/artistic-license.txt',
      'CPOL 1.02': '../licenses/cpol-1-02.txt',
      'Ms-PL': '../licenses/ms-pl.txt'
    };
    const license = licenses[this.question];
    if (license) {
      return licenses[this.question];
    }
  }

  /* Add or remove class to sidebar*/
  showSidebar(value) {
    if (value) {
      $('.sidebar').addClass('active');
    } else {
      $('.sidebar').removeClass('active');
    }

    this.sidebarActive = value;
  }

  /* Add or remove class for active or owners or project users */
  showUsers() {
    $('.users').addClass('active');
    $('.owners').removeClass('active');

    $('#projectOwners').hide();
    $('#users').fadeIn();
  }

  /* Add or remove class for active or owners or project owners */
  showOwners() {
    $('.owners').addClass('active');
    $('.users').removeClass('active');

    $('#users').hide();
    $('#projectOwners').fadeIn();

  }

  /*Show one by one answers on the right side of the page */
  showAnswer(event) {
    const id = event.srcElement.className;
    const prev = $('.question.active span');
    const elem = $('#' + id);

    const div = $('#div_' + id);
    if (elem.css('display') === 'none') {
      div.addClass('active');
      elem.slideToggle();
      elem.css('display', 'block');
      if (prev !== elem) {
        prev.slideToggle();
        prev.parent().removeClass('active');
      }
    } else {
      elem.slideToggle();
      div.removeClass('active');
    }
  }

  /* Load the script element form body and also when loads page remove the active class*/
  ngOnInit() {
    const script = document.createElement('script');
    document.body.appendChild(script);
    script.src = 'https://buttons.github.io/buttons.js';
    $(document).click(function(e) {
                const target = $(e.target);
                if (!target.parents().is('.sidebar') && !target.is('.sidebar') && !target.is('.faq')) {
                    if ($('.sidebar').hasClass('active')) {
                        $('.sidebar').removeClass('active');
                    }
                }
            });

  }

  refresh(): void {
    window.location.reload();
  }

}
