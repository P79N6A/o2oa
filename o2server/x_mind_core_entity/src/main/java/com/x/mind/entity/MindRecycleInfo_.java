/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.mind.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.Boolean;
import java.lang.Integer;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.mind.entity.MindRecycleInfo.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Dec 21 15:31:16 CST 2018")
public class MindRecycleInfo_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<MindRecycleInfo,String> creator;
    public static volatile SingularAttribute<MindRecycleInfo,String> creatorUnit;
    public static volatile SingularAttribute<MindRecycleInfo,String> creatorUnit_sequence;
    public static volatile SingularAttribute<MindRecycleInfo,String> creator_sequence;
    public static volatile SingularAttribute<MindRecycleInfo,String> deleteor;
    public static volatile SingularAttribute<MindRecycleInfo,String> description;
    public static volatile SingularAttribute<MindRecycleInfo,Date> fileCreateTime;
    public static volatile SingularAttribute<MindRecycleInfo,Integer> fileVersion;
    public static volatile SingularAttribute<MindRecycleInfo,String> folderId;
    public static volatile SingularAttribute<MindRecycleInfo,String> folder_sequence;
    public static volatile SingularAttribute<MindRecycleInfo,String> id;
    public static volatile SingularAttribute<MindRecycleInfo,String> name;
    public static volatile SingularAttribute<MindRecycleInfo,Boolean> shared;
    public static volatile SingularAttribute<MindRecycleInfo,String> shared_sequence;
}
